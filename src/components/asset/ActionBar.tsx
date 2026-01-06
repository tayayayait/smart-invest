import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { strings } from "@/data/strings.ko";

interface ActionBarProps {
  onBuy?: () => void;
  onSell?: () => void;
  onRebalance?: () => void;
  onJournal?: () => void;
  className?: string;
}

export function ActionBar({
  onBuy,
  onSell,
  onRebalance,
  onJournal,
  className,
}: ActionBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm",
        "safe-area-bottom",
        className,
      )}
    >
      <div className="mx-auto flex max-w-xl items-center gap-2 px-4 py-3">
        <Button className="flex-1" onClick={onBuy}>
          {strings.assetDetail.actions.buy}
        </Button>
        <Button variant="outline" className="flex-1" onClick={onSell}>
          {strings.assetDetail.actions.sell}
        </Button>
      </div>
      <div className="mx-auto flex max-w-xl items-center gap-2 px-4 pb-4">
        <Button variant="secondary" className="flex-1" onClick={onRebalance}>
          {strings.assetDetail.actions.rebalance}
        </Button>
        <Button variant="outline" className="flex-1" onClick={onJournal}>
          {strings.assetDetail.actions.journal}
        </Button>
      </div>
    </div>
  );
}
