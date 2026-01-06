import { cn } from "@/lib/utils";
import { CMIBadge } from "../ui/CMIBadge";
import { StrategyCard } from "../ui/StrategyCard";
import { Button } from "../ui/button";
import { Activity, Brain, Target, CheckCircle, Info, BookMarked } from "lucide-react";
import { useState } from "react";
import { strings } from "@/data/strings.ko";

interface Evidence {
  type: "news" | "indicator";
  title: string;
  impact: number;
  source?: string;
}

interface Strategy {
  id: string;
  title: string;
  description: string;
  expectedReturn: string;
  risk: "low" | "medium" | "high";
  confidence: number;
}

interface AIResponseContainerProps {
  signal: {
    cmi: number;
    confidence: number;
    summary: string;
  };
  interpretation: {
    analysis: string;
    evidences: Evidence[];
  };
  isEvidenceLoading?: boolean;
  evidenceFallback?: string;
  strategies: Strategy[];
  selectedStrategy?: string;
  onStrategySelect?: (id: string) => void;
  onLogAction?: () => void;
  onExplain?: () => void;
  className?: string;
}

type Scenario = "optimistic" | "neutral" | "pessimistic";

export function AIResponseContainer({
  signal,
  interpretation,
  isEvidenceLoading,
  evidenceFallback,
  strategies,
  selectedStrategy,
  onStrategySelect,
  onLogAction,
  onExplain,
  className,
}: AIResponseContainerProps) {
  const [scenario, setScenario] = useState<Scenario>("neutral");

  const scenarioLabels: Record<Scenario, string> = {
    optimistic: strings.ai.scenario.optimistic,
    neutral: strings.ai.scenario.neutral,
    pessimistic: strings.ai.scenario.pessimistic,
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Signal Section */}
      <div className="rounded-lg bg-card p-4 shadow-card animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">{strings.ai.sections.signal}</h3>
        </div>
        <div className="flex items-center justify-between mb-3">
          <CMIBadge value={signal.cmi} confidence={signal.confidence} size="md" showLabel />
        </div>
        <p className="text-body text-muted-foreground">{signal.summary}</p>
      </div>

      {/* Interpretation Section */}
      <div className="rounded-lg bg-card p-4 shadow-card animate-fade-in-up stagger-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {strings.ai.sections.interpretation}
            </h3>
          </div>
          <button
            onClick={onExplain}
            className="flex items-center gap-1 text-caption text-primary hover:text-primary/80"
          >
            <Info className="h-4 w-4" />
            {strings.ai.explainLink}
          </button>
        </div>
        <p className="text-body text-foreground mb-4">{interpretation.analysis}</p>

        {/* Evidence Cards */}
        <div className="space-y-2">
          {interpretation.evidences.length === 0 && isEvidenceLoading && (
            <div className="rounded-lg bg-accent/50 px-3 py-2 text-caption text-muted-foreground">
              {strings.ai.newsLoading}
            </div>
          )}
          {interpretation.evidences.length === 0 && !isEvidenceLoading && (
            <div className="rounded-lg bg-accent/50 px-3 py-2 text-caption text-muted-foreground">
              {evidenceFallback ?? strings.ai.newsEmpty}
            </div>
          )}
          {interpretation.evidences.map((evidence, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <div className="flex-1 min-w-0">
                <p className="text-caption font-medium text-foreground truncate">
                  {evidence.title}
                </p>
                {evidence.source && (
                  <p className="text-[10px] text-muted-foreground">
                    {strings.ai.sourceLabel}: {evidence.source}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <span className="text-caption font-medium text-primary">
                  {strings.format.impact(evidence.impact)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Toggle */}
      <div className="flex items-center gap-2 p-1 rounded-lg bg-secondary animate-fade-in-up stagger-2">
        {(["optimistic", "neutral", "pessimistic"] as Scenario[]).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-caption font-medium transition-all",
              scenario === s
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {scenarioLabels[s]}
          </button>
        ))}
      </div>

      {/* Strategy Section */}
      <div className="animate-fade-in-up stagger-3">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">{strings.ai.sections.strategy}</h3>
        </div>

        <div className="space-y-3">
          {strategies.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              title={strategy.title}
              description={strategy.description}
              expectedReturn={strategy.expectedReturn}
              risk={strategy.risk}
              confidence={strategy.confidence}
              selected={selectedStrategy === strategy.id}
              onSelect={() => onStrategySelect?.(strategy.id)}
            />
          ))}
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-3 pt-2 animate-fade-in-up stagger-4">
        <Button variant="outline" className="flex-1" onClick={onLogAction}>
          <BookMarked className="h-4 w-4 mr-2" />
          {strings.ai.logButton}
        </Button>
        <Button className="flex-1" disabled={!selectedStrategy}>
          <CheckCircle className="h-4 w-4 mr-2" />
          {strings.ai.executeButton}
        </Button>
      </div>
    </div>
  );
}
