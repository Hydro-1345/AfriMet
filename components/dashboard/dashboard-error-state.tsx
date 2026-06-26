import { AuthMessage } from "@/components/auth/auth-message";

interface DashboardErrorStateProps {
  message: string;
}

export function DashboardErrorState({ message }: DashboardErrorStateProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <AuthMessage message={message} variant="error" />
    </div>
  );
}
