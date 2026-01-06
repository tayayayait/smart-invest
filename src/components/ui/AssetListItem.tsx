import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/format";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { strings } from "@/data/strings.ko";

interface AssetListItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  holdings?: number;
  sparkline?: number[];
  quoteStatus?: "live" | "delayed";
  onClick?: () => void;
  className?: string;
}

export function AssetListItem({
  symbol,
  name,
  price,
  change,
  changePercent,
  holdings,
  sparkline,
  quoteStatus,
  onClick,
  className,
}: AssetListItemProps) {
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg bg-card p-3 cursor-pointer",
        "transition-all duration-200 hover:bg-accent active:scale-[0.99]",
        className,
      )}
      onClick={onClick}
    >
      {/* Symbol & Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{symbol}</span>
          {holdings !== undefined && (
            <span className="text-caption text-muted-foreground">
              {strings.format.holdings(holdings)}
            </span>
          )}
        </div>
        <p className="text-caption text-muted-foreground truncate">{name}</p>
      </div>

      {/* Sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div className="w-16 h-8 flex items-end gap-px">
          {sparkline.slice(-12).map((value, i, arr) => {
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            const range = max - min || 1;
            const height = ((value - min) / range) * 100;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-sm",
                  isPositive ? "bg-success" : isNegative ? "bg-error" : "bg-neutral-40",
                )}
                style={{ height: `${Math.max(10, height)}%` }}
              />
            );
          })}
        </div>
      )}

      {/* Price & Change */}
      <div className="text-right">
        <div className="flex items-center justify-end gap-2">
          {quoteStatus && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                quoteStatus === "live"
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {quoteStatus === "live" ? strings.asset.liveLabel : strings.asset.delayedLabel}
            </span>
          )}
          <div className="font-tabular font-semibold text-foreground">
            {formatCurrency(price)}
          </div>
        </div>
        <div
          className={cn(
            "flex items-center justify-end gap-1 text-caption font-tabular",
            isPositive && "text-success",
            isNegative && "text-error",
            !isPositive && !isNegative && "text-muted-foreground",
          )}
        >
          <TrendIcon className="h-3 w-3" />
          <span>{formatPercent(changePercent)}</span>
        </div>
      </div>
    </div>
  );
}
