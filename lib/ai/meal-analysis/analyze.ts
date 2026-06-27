import type { SupabaseClient } from "@supabase/supabase-js";
import "server-only";
import OpenAI from "openai";
import {
  FOOD_CONTEXT_LIMIT,
  OPENAI_MEAL_ANALYSIS_MODEL,
  OPENAI_REQUEST_TIMEOUT_MS,
} from "@/lib/ai/constants";
import { getOpenAIClient } from "@/lib/ai/client";
import {
  buildMealAnalysisSystemPrompt,
  buildMealAnalysisUserText,
  getMealAnalysisJsonSchema,
} from "@/lib/ai/meal-analysis/prompt";
import {
  aiMealAnalysisResponseSchema,
  type AiMealAnalysisResponse,
} from "@/lib/analysis/schemas";
import { searchFoods } from "@/lib/foods/queries";
import { downloadMealImageBuffer } from "@/lib/meals/image-download";
import type { Meal } from "@/types/meal";

export type MealAnalysisRunResult =
  | { success: true; data: AiMealAnalysisResponse; model: string }
  | { success: false; error: string; developerMessage?: string };

function mapOpenAIError(error: unknown): MealAnalysisRunResult {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return {
        success: false,
        error: "The analysis service is busy. Please wait a moment and try again.",
        developerMessage: `OpenAI rate limit: ${error.message}`,
      };
    }

    if (error.status === 401) {
      return {
        success: false,
        error: "Meal analysis is temporarily unavailable. Please contact support.",
        developerMessage: "OpenAI authentication failed.",
      };
    }

    return {
      success: false,
      error: "Unable to analyze this meal right now. Please try again.",
      developerMessage: `OpenAI API error ${error.status}: ${error.message}`,
    };
  }

  if (error instanceof Error && error.name === "AbortError") {
    return {
      success: false,
      error: "Analysis timed out. Please try again.",
      developerMessage: "OpenAI request timed out.",
    };
  }

  if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
    return {
      success: false,
      error: "Meal analysis is not configured yet. Please try again later.",
      developerMessage: error.message,
    };
  }

  return {
    success: false,
    error: "Unable to analyze this meal. Please try again.",
    developerMessage: error instanceof Error ? error.message : "Unknown analysis error.",
  };
}

async function getFoodContext(
  supabase: SupabaseClient,
  description: string
): Promise<{ name: string; aliases: string[] }[]> {
  const words = description
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3)
    .slice(0, 5);

  const queries = words.length > 0 ? words : [description.slice(0, 40)];

  const results = await Promise.all(
    queries.map((query) =>
      searchFoods(supabase, {
        query,
        page: 1,
        pageSize: FOOD_CONTEXT_LIMIT,
      })
    )
  );

  const unique = new Map<string, { name: string; aliases: string[] }>();

  for (const result of results) {
    for (const food of result.foods) {
      unique.set(food.id, { name: food.name, aliases: food.aliases });
    }
  }

  return Array.from(unique.values()).slice(0, FOOD_CONTEXT_LIMIT);
}

function parseAnalysisResponse(content: string): MealAnalysisRunResult {
  try {
    const json = JSON.parse(content) as unknown;
    const parsed = aiMealAnalysisResponseSchema.safeParse(json);

    if (!parsed.success) {
      return {
        success: false,
        error: "The analysis response was invalid. Please try again.",
        developerMessage: parsed.error.message,
      };
    }

    return {
      success: true,
      data: parsed.data,
      model: OPENAI_MEAL_ANALYSIS_MODEL,
    };
  } catch (error) {
    return {
      success: false,
      error: "The analysis response could not be read. Please try again.",
      developerMessage: error instanceof Error ? error.message : "JSON parse failed.",
    };
  }
}

export async function runMealAnalysis(
  supabase: SupabaseClient,
  meal: Meal
): Promise<MealAnalysisRunResult> {
  const hasDescription = meal.description.trim().length > 0;
  const hasImage = Boolean(meal.imageUrl);

  if (!hasDescription && !hasImage) {
    return {
      success: false,
      error: "Add a meal description or photo before running analysis.",
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "Meal analysis is not configured yet. Please try again later.",
      developerMessage: "OPENAI_API_KEY is missing.",
    };
  }

  const foodContext = await getFoodContext(
    supabase,
    hasDescription ? meal.description : "meal photo"
  );

  const userText = buildMealAnalysisUserText(
    hasDescription ? meal.description : "No description provided. Analyze from the image only.",
    foodContext.map((food) => ({
      id: food.name,
      slug: food.name,
      name: food.name,
      description: null,
      region: "west_africa",
      categoryId: "",
      categorySlug: "",
      categoryName: "",
      servingDescription: null,
      servingGrams: null,
      isDiaspora: false,
      aliases: food.aliases,
      createdAt: "",
      updatedAt: "",
    }))
  );

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: userText },
  ];

  if (hasImage && meal.imageUrl) {
    const imageResult = await downloadMealImageBuffer(supabase, meal.imageUrl);

    if (imageResult.error || !imageResult.buffer) {
      return {
        success: false,
        error: imageResult.error ?? "Unable to read the meal image.",
      };
    }

    const base64 = imageResult.buffer.toString("base64");
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:${imageResult.mimeType};base64,${base64}`,
      },
    });
  }

  try {
    const client = getOpenAIClient();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENAI_REQUEST_TIMEOUT_MS);

    const response = await client.chat.completions.create(
      {
        model: OPENAI_MEAL_ANALYSIS_MODEL,
        temperature: 0.2,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "meal_analysis",
            strict: true,
            schema: getMealAnalysisJsonSchema(),
          },
        },
        messages: [
          { role: "system", content: buildMealAnalysisSystemPrompt() },
          { role: "user", content: userContent },
        ],
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "No analysis was returned. Please try again.",
        developerMessage: "OpenAI returned empty content.",
      };
    }

    return parseAnalysisResponse(content);
  } catch (error) {
    console.error("[meal-analysis] OpenAI request failed:", error);
    return mapOpenAIError(error);
  }
}
