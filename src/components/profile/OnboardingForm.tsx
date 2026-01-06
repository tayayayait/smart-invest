import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { strings } from "@/data/strings.ko";
import { cn } from "@/lib/utils";

export type ProfileSettings = {
  investorType: string;
  goal: string;
  riskTolerance: number;
  focusIndustries: string[];
};

const investorOptions = [
  { value: "aggressive", label: "공격형" },
  { value: "balanced", label: "밸런스형" },
  { value: "conservative", label: "안정형" },
];

const industryOptions = [
  "AI/클라우드",
  "반도체",
  "친환경",
  "헬스케어",
  "소비재",
  "금융",
];

interface OnboardingFormProps {
  initialSettings: ProfileSettings;
  onSubmit: (settings: ProfileSettings) => void;
}

export function OnboardingForm({ initialSettings, onSubmit }: OnboardingFormProps) {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const toggleIndustry = (industry: string) => {
    setSettings((prev) => {
      const list = prev.focusIndustries.includes(industry)
        ? prev.focusIndustries.filter((item) => item !== industry)
        : [...prev.focusIndustries, industry];
      return { ...prev, focusIndustries: list };
    });
  };

  const handleSave = () => {
    onSubmit(settings);
  };

  const isValid = settings.goal.trim().length > 0;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!isValid) return;
        handleSave();
      }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label>{strings.profile.fields.investorType}</Label>
        <Select
          value={settings.investorType}
          onValueChange={(value) => setSettings((prev) => ({ ...prev, investorType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={strings.profile.placeholders.investorType} />
          </SelectTrigger>
          <SelectContent>
            {investorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{strings.profile.fields.goal}</Label>
        <Input
          value={settings.goal}
          onChange={(event) => setSettings((prev) => ({ ...prev, goal: event.target.value }))}
          placeholder={strings.profile.placeholders.goal}
        />
      </div>

      <div className="space-y-2">
        <Label>{strings.profile.fields.risk}</Label>
        <div className="flex items-center justify-between text-caption text-muted-foreground">
          <span>{strings.profile.riskLabels.low}</span>
          <span className="text-foreground font-semibold">{settings.riskTolerance}%</span>
          <span>{strings.profile.riskLabels.high}</span>
        </div>
        <Slider
          value={[settings.riskTolerance]}
          onValueChange={(value) => setSettings((prev) => ({ ...prev, riskTolerance: value[0] }))}
          max={100}
          min={0}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{strings.profile.fields.industries}</Label>
          <span className="text-[11px] text-muted-foreground">
            {settings.focusIndustries.length}/{industryOptions.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {industryOptions.map((option) => {
            const selected = settings.focusIndustries.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleIndustry(option)}
                className={cn(
                  "px-3 py-1 rounded-full text-[12px] border transition",
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/60 text-muted-foreground border-transparent hover:border-border",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={!isValid}>
        {strings.profile.actions.save}
      </Button>
    </form>
  );
}
