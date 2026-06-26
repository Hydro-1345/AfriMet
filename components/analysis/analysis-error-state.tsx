import { AlertCircle } from "lucide-react";
import { AuthMessage } from "@/components/auth/auth-message";

interface AnalysisErrorStateProps {
  message: string;
}

export function AnalysisErrorState({ message }: AnalysisErrorStateProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle aria-hidden className="h-5 w-5" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">Analysis failed</p>
        <p className="mt-1.5 text-sm text-muted-foreground">{message}</p>
      </div>
      <AuthMessage message={message} variant="error" />
    </div>
  );
}
