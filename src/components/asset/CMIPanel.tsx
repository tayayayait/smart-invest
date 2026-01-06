import { useState } from "react";
import { cn } from "@/lib/utils";
import { CMIGauge } from "@/components/ui/CMIGauge";
import { strings } from "@/data/strings.ko";

type EvidenceType = "news" | "indicator" | "event";

interface EvidenceItem {
  title: string;
  impact?: number;
  source?: string;
  type?: EvidenceType;
}

interface CMIPanelProps {
  cmi: number;
  confidence: number;
  summary?: string;
  evidences: EvidenceItem[];
  isNewsLoading?: boolean;
  newsFallback?: string;
  className?: string;
}

type Scenario = "optimistic" | "neutral" | "pessimistic";

export function CMIPanel({
  cmi,
  confidence,
  summary,
  evidences,
  isNewsLoading,
  newsFallback,
  className,
}: CMIPanelProps) {
  const [scenario, setScenario] = useState<Scenario>("neutral");

  const scenarioLabels: Record<Scenario, string> = {
    optimistic: strings.ai.scenario.optimistic,
    neutral: strings.ai.scenario.neutral,
    pessimistic: strings.ai.scenario.pessimistic,
  };

  return (
    <section className={cn("rounded-lg bg-card p-6 shadow-card transition-all hover:shadow-lg", className)}>
      <div className="mb-6 text-center">
        <h2 className="text-h3 text-foreground font-semibold mb-1">
          {strings.assetDetail.cmiPanelTitle}
        </h2>
        <p className="text-sm text-muted-foreground">
          {strings.format.confidence(confidence)}
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <CMIGauge value={cmi} />
      </div>

      {summary && <p className="text-body text-foreground mb-4">{summary}</p>}

      <div className="space-y-2 mb-4">
        <p className="text-caption font-medium text-muted-foreground">
          {strings.assetDetail.evidenceTitle}
        </p>
        {evidences.length === 0 && isNewsLoading && (
          <div className="rounded-lg bg-accent/30 px-3 py-2 text-caption text-muted-foreground">
            {strings.assetDetail.newsLoading}
          </div>
        )}
        {evidences.length === 0 && !isNewsLoading && (
          <div className="rounded-lg bg-accent/30 px-3 py-2 text-caption text-muted-foreground">
            {newsFallback ?? strings.assetDetail.newsEmpty}
          </div>
        )}
        {evidences.map((item, index) => {
          const isNews = item.type === "news";
          return (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/40">
              <div className="flex-1 min-w-0">
                <p className="text-caption font-medium text-foreground truncate">{item.title}</p>
                {item.source && (
                  <p className="text-[10px] text-muted-foreground">
                    {strings.ai.sourceLabel}: {item.source}
                  </p>
                )}
              </div>
              {!isNews && item.impact !== undefined && (
                <div className="shrink-0 text-right">
                  <span className="text-caption font-medium text-primary">
                    {strings.format.impact(item.impact)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <p className="text-caption font-medium text-muted-foreground mb-2">
          {strings.assetDetail.scenarioTitle}
        </p>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-secondary">
          {(["optimistic", "neutral", "pessimistic"] as Scenario[]).map((value) => (
            <button
              key={value}
              onClick={() => setScenario(value)}
              className={cn(
                "flex-1 py-2 px-3 rounded-md text-caption font-medium transition-all",
                scenario === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {scenarioLabels[value]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
