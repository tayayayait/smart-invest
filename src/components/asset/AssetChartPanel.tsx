import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { strings } from "@/data/strings.ko";
import { useCandles } from "@/hooks/useCandles";
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, Bar, BarChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

type Range = "day" | "week" | "month";

interface AssetChartPanelProps {
  symbol?: string;
  className?: string;
}

export function AssetChartPanel({ symbol, className }: AssetChartPanelProps) {
  const [range, setRange] = useState<Range>("week");
  const candles = useCandles(symbol, range);

  const chartData = useMemo(() => {
    if (!candles.data || candles.data.s !== "ok") return [];
    return candles.data.t.map((time, index) => ({
      time: new Date(time * 1000),
      label:
        range === "day"
          ? new Date(time * 1000).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : new Date(time * 1000).toLocaleDateString("ko-KR", {
              month: "2-digit",
              day: "2-digit",
            }),
      close: candles.data?.c?.[index] ?? 0,
      volume: candles.data?.v?.[index] ?? 0,
    }));
  }, [candles.data, range]);

  const hasData = chartData.length > 0;
  const ranges: { value: Range; label: string }[] = [
    { value: "day", label: strings.assetDetail.range.day },
    { value: "week", label: strings.assetDetail.range.week },
    { value: "month", label: strings.assetDetail.range.month },
  ];

  return (
    <section className={cn("rounded-lg bg-card p-4 shadow-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-foreground font-semibold">
          {strings.assetDetail.chartTitle}
        </h2>
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {ranges.map((item) => (
            <button
              key={item.value}
              onClick={() => setRange(item.value)}
              className={cn(
                "px-3 py-1.5 text-caption font-medium rounded-md transition-colors",
                range === item.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {candles.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !hasData ? (
          <div className="space-y-3">
            <div className="h-48 rounded-lg border border-dashed border-border bg-muted/40 flex items-center justify-center text-caption text-muted-foreground">
              {strings.assetDetail.placeholders.candlestick}
            </div>
            <div className="h-16 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center text-caption text-muted-foreground">
              {strings.assetDetail.placeholders.volume}
            </div>
            <div className="h-24 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center text-caption text-muted-foreground">
              {strings.assetDetail.placeholders.fan}
            </div>
          </div>
        ) : (
          <>
            <ChartContainer
              className="h-48 w-full"
              config={{
                close: {
                  label: "종가",
                  color: "hsl(var(--primary))",
                },
              }}
            >
                <LineChart data={chartData}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="var(--color-close)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
            </ChartContainer>

            <ChartContainer
              className="h-16 w-full"
              config={{
                volume: {
                  label: "거래량",
                  color: "hsl(var(--muted-foreground))",
                },
              }}
            >
                <BarChart data={chartData}>
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Bar dataKey="volume" fill="var(--color-volume)" radius={[2, 2, 0, 0]} />
                </BarChart>
            </ChartContainer>

            <div className="h-24 rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center text-caption text-muted-foreground">
              {strings.assetDetail.placeholders.fan}
            </div>
          </>
        )}
      </div>
    </section>
  );
}


