import { cn } from "@/lib/utils";

interface SprintNoticeProps {
  sprint: string;
  title: string;
  description: string;
  className?: string;
}

export function SprintNotice({
  sprint,
  title,
  description,
  className,
}: SprintNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/20 bg-primary/5 px-4 py-3",
        className
      )}
      role="status"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {sprint}
      </p>
      <p className="mt-1 font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
