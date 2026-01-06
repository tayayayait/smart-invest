import { CMIBadge } from "../ui/CMIBadge";
import { FinancialCard } from "../ui/FinancialCard";
import { formatDate } from "@/lib/format";
import { RefreshCw } from "lucide-react";
import { strings } from "@/data/strings.ko";

interface CMISummaryProps {
  cmiValue: number;
  confidence: number;
  summary: string;
  keywords: readonly string[];
  lastUpdated: Date;
  onRefresh?: () => void;
  exchangeRateLabel?: string;
  exchangeRateText?: string;
  exchangeRateFallback?: string;
}

export function CMISummary({
  cmiValue,
  confidence,
  summary,
  keywords,
  lastUpdated,
  onRefresh,
  exchangeRateLabel,
  exchangeRateText,
  exchangeRateFallback,
}: CMISummaryProps) {
  const hasExchangeRate = Boolean(exchangeRateText || exchangeRateFallback);

  return (
    <FinancialCard className="animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-caption text-muted-foreground mb-1">
            {strings.home.cmiSummaryTitle}
          </p>
          <CMIBadge value={cmiValue} confidence={confidence} size="lg" showLabel />
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-full hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <p className="text-body text-foreground mb-3">{summary}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {keywords.map((keyword, i) => (
          <span
            key={i}
            className="px-2 py-1 rounded-full bg-accent text-caption text-accent-foreground"
          >
            #{keyword}
          </span>
        ))}
      </div>

      {hasExchangeRate && (
        <div className="mb-3 rounded-lg bg-muted/50 px-3 py-2">
          {exchangeRateLabel && (
            <p className="text-[11px] text-muted-foreground">{exchangeRateLabel}</p>
          )}
          <p className="text-caption font-medium text-foreground">
            {exchangeRateText ?? exchangeRateFallback}
          </p>
        </div>
      )}

      <p className="text-caption text-muted-foreground">
        {strings.format.updateStamp(formatDate(lastUpdated, "time"))}
      </p>
    </FinancialCard>
  );
}
