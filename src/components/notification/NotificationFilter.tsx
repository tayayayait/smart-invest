import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { strings } from "@/data/strings.ko";
import type { NotificationType } from "./NotificationItem";

interface NotificationFilterProps {
  selectedType: "all" | NotificationType;
  onTypeChange: (type: "all" | NotificationType) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

const filterOptions: { value: "all" | NotificationType; label: string }[] = [
  { value: "all", label: strings.notification.filters.all },
  { value: "signal", label: strings.notification.filters.signal },
  { value: "event", label: strings.notification.filters.event },
  { value: "strategy", label: strings.notification.filters.strategy },
  { value: "warning", label: strings.notification.filters.warning },
];

export function NotificationFilter({
  selectedType,
  onTypeChange,
  query,
  onQueryChange,
}: NotificationFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-caption font-medium transition-colors",
              selectedType === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={strings.notification.searchPlaceholder}
          className="pl-9"
        />
      </div>
    </div>
  );
}
