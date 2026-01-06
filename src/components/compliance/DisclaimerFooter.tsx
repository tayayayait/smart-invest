import { cn } from "@/lib/utils";

interface DisclaimerFooterProps {
  primary: string;
  secondary?: string;
  className?: string;
}

export function DisclaimerFooter({ primary, secondary, className }: DisclaimerFooterProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 text-caption text-muted-foreground", className)}>
      <p>{primary}</p>
      {secondary && <p className="mt-2">{secondary}</p>}
    </div>
  );
}
