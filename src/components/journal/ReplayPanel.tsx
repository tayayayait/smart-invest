import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { strings } from "@/data/strings.ko";

interface ReplayPanelProps {
  className?: string;
}

export function ReplayPanel({ className }: ReplayPanelProps) {
  return (
    <section className={cn("rounded-lg bg-card p-4 shadow-card", className)}>
      <h2 className="text-h3 text-foreground font-semibold mb-4">
        {strings.learningLoop.replayTitle}
      </h2>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>{strings.learningLoop.replay.dateLabel}</Label>
          <Input type="date" />
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-caption text-muted-foreground">
            {strings.learningLoop.replay.cmi}
          </div>
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-caption text-muted-foreground">
            {strings.learningLoop.replay.portfolio}
          </div>
          <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-caption text-muted-foreground">
            {strings.learningLoop.replay.ai}
          </div>
        </div>
      </div>
    </section>
  );
}
