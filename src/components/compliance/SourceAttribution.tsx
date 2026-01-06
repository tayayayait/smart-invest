import { cn } from "@/lib/utils";

interface SourceAttributionProps {
  source: string;
  className?: string;
}

export function SourceAttribution({ source, className }: SourceAttributionProps) {
  return (
    <div className={cn("text-caption text-muted-foreground", className)}>
      {source}
    </div>
  );
}
