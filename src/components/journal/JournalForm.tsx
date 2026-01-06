import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { strings } from "@/data/strings.ko";

interface JournalFormProps {
  className?: string;
}

export function JournalForm({ className }: JournalFormProps) {
  return (
    <section className={cn("rounded-lg bg-card p-4 shadow-card", className)}>
      <h2 className="text-h3 text-foreground font-semibold mb-4">
        {strings.learningLoop.journalTitle}
      </h2>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>{strings.learningLoop.fields.hypothesis}</Label>
          <Input placeholder={strings.learningLoop.placeholders.hypothesis} />
        </div>

        <div className="space-y-1.5">
          <Label>{strings.learningLoop.fields.evidence}</Label>
          <Textarea
            rows={3}
            placeholder={strings.learningLoop.placeholders.evidence}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{strings.learningLoop.fields.choice}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={strings.learningLoop.fields.choice} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">{strings.learningLoop.choiceOptions.buy}</SelectItem>
              <SelectItem value="sell">{strings.learningLoop.choiceOptions.sell}</SelectItem>
              <SelectItem value="hold">{strings.learningLoop.choiceOptions.hold}</SelectItem>
              <SelectItem value="watch">{strings.learningLoop.choiceOptions.watch}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>{strings.learningLoop.fields.risk}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={strings.learningLoop.fields.risk} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{strings.learningLoop.riskOptions.low}</SelectItem>
              <SelectItem value="medium">{strings.learningLoop.riskOptions.medium}</SelectItem>
              <SelectItem value="high">{strings.learningLoop.riskOptions.high}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>{strings.learningLoop.fields.result}</Label>
          <Textarea rows={3} placeholder={strings.learningLoop.placeholders.result} />
        </div>
      </div>
    </section>
  );
}
