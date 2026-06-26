import { cn } from "@/lib/utils";

interface AuthMessageProps {
  variant: "error" | "success";
  message: string;
  className?: string;
}

export function AuthMessage({ variant, message, className }: AuthMessageProps) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variant === "error" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        variant === "success" &&
          "border-primary/30 bg-primary/10 text-foreground",
        className
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}
