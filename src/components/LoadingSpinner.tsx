import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("animate-spin rounded-full h-32 w-32 border-b-2 border-primary", className)} />
  );
}
