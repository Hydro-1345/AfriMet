import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "main" | "div";
}

export function PageContainer({
  children,
  className,
  as: Component = "main",
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
        className
      )}
      id="main-content"
    >
      {children}
    </Component>
  );
}
