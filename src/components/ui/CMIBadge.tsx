import { cn } from "@/lib/utils";
import { getCMILevel } from "@/lib/format";
import { strings } from "@/data/strings.ko";

interface CMIBadgeProps {
  value: number;
  confidence?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function CMIBadge({
  value,
  confidence,
  size = "md",
  showLabel = false,
  className,
}: CMIBadgeProps) {
  const level = getCMILevel(value);

  const sizeClasses = {
    sm: "h-6 min-w-[3rem] text-xs",
    md: "h-8 min-w-[4rem] text-sm",
    lg: "h-10 min-w-[5rem] text-base",
  };

  const levelLabels = {
    low: strings.cmiBadge.levelLabels.low,
    medium: strings.cmiBadge.levelLabels.medium,
    high: strings.cmiBadge.levelLabels.high,
  };

  const getGradientStyle = () => {
    const percentage = Math.min(100, Math.max(0, value));
    return {
      background: `linear-gradient(90deg, 
        hsl(var(--cmi-0)) 0%,
        hsl(var(--cmi-${percentage < 25 ? "0" : percentage < 50 ? "25" : percentage < 75 ? "50" : percentage < 90 ? "75" : "100"})) 100%
      )`,
    };
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 font-tabular font-semibold text-neutral-0",
          sizeClasses[size],
        )}
        style={getGradientStyle()}
      >
        {value}
        {showLabel && <span className="ml-1 font-normal">{levelLabels[level]}</span>}
      </div>
      {confidence !== undefined && (
        <span className="text-caption text-muted-foreground font-tabular">
          {strings.format.confidence(confidence)}
        </span>
      )}
    </div>
  );
}
