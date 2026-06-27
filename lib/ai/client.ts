import "server-only";

import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  const apiKey = getServerEnv().OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
