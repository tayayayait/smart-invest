import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CMIBadge } from "./CMIBadge";
import { Info } from "lucide-react";
import { strings } from "@/data/strings.ko";

interface StrategyCardProps {
  title: string;
  description: string;
  expectedReturn?: string;
  risk?: "low" | "medium" | "high";
  confidence?: number;
  selected?: boolean;
  onSelect?: () => void;
  onDetails?: () => void;
  className?: string;
}

export function StrategyCard({
  title,
  description,
  expectedReturn,
  risk,
  confidence,
  selected = false,
  onSelect,
  onDetails,
  className,
}: StrategyCardProps) {
  const riskColors = {
    low: "text-success bg-success-weak",
    medium: "text-warning bg-warning-weak",
    high: "text-error bg-error-weak",
  };

  const riskLabels = {
    low: strings.strategy.riskLevels.low,
    medium: strings.strategy.riskLevels.medium,
    high: strings.strategy.riskLevels.high,
  };

  return (
    <div
      className={cn(
        "rounded-lg bg-card p-4 shadow-card border-2 transition-all duration-200",
        selected ? "border-primary" : "border-transparent",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-caption text-muted-foreground mt-1">{description}</p>
        </div>
        {confidence !== undefined && <CMIBadge value={confidence} size="sm" />}
      </div>

      <div className="flex items-center gap-3 mb-4">
        {expectedReturn && (
          <div className="flex items-center gap-1.5">
            <span className="text-caption text-muted-foreground">
              {strings.strategy.expectedReturnLabel}:
            </span>
            <span className="font-tabular font-medium text-success">{expectedReturn}</span>
          </div>
        )}
        {risk && (
          <div className="flex items-center gap-1.5">
            <span className="text-caption text-muted-foreground">
              {strings.strategy.riskLabel}
            </span>
            <span
              className={cn(
                "text-caption font-medium px-2 py-0.5 rounded-full",
                riskColors[risk],
              )}
            >
              {riskLabels[risk]}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={selected ? "default" : "outline"}
          size="sm"
          className="flex-1"
          onClick={onSelect}
        >
          {selected ? strings.strategy.selectedButton : strings.strategy.selectButton}
        </Button>
        {onDetails && (
          <Button variant="ghost" size="sm" onClick={onDetails}>
            <Info className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
