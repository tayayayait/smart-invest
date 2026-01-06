import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StrategyCard } from "@/components/ui/StrategyCard";
import { strings } from "@/data/strings.ko";
import { Sparkles, ArrowRight } from "lucide-react";

interface StrategyItem {
  id: string;
  title: string;
  description: string;
  expectedReturn: string;
  risk: "low" | "medium" | "high";
  confidence: number;
}

interface StrategySuggestionsProps {
  strategies: StrategyItem[];
  onSelect?: (id: string) => void;
  onDetails?: (id: string) => void;
  selectedId?: string;
  className?: string;
}

export function StrategySuggestions({
  strategies,
  onSelect,
  onDetails,
  selectedId,
  className,
}: StrategySuggestionsProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-h3 text-foreground font-semibold">
          {strings.assetDetail.strategyTitle}
        </h2>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="group space-y-2">
            <div className="relative">
              {/* Visual connection line if needed, or just better spacing */}
              <StrategyCard
                title={strategy.title}
                description={strategy.description}
                expectedReturn={strategy.expectedReturn}
                risk={strategy.risk}
                confidence={strategy.confidence}
                selected={selectedId === strategy.id}
                onSelect={() => onSelect?.(strategy.id)}
              />
            </div>

            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary gap-1"
                onClick={() => onDetails?.(strategy.id)}
              >
                {strings.assetDetail.detailReasonLabel}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
