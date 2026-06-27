import { ErrorState } from "@/components/ui/error-state";

interface DashboardErrorStateProps {
  message: string;
}

export function DashboardErrorState({ message }: DashboardErrorStateProps) {
  return <ErrorState message={message} title="Analytics unavailable" />;
}
