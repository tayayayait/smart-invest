import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
  title: string;
  description?: string;
  className?: string;
}

export function WarningBanner({ title, description, className }: WarningBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-warning/40 bg-warning-weak p-4 text-warning",
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-1 text-xs text-warning/90">{description}</p>}
      </div>
    </div>
  );
}
