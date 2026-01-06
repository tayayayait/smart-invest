import { cn } from "@/lib/utils";
import {
  Activity,
  Newspaper,
  TrendingUp,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";
import { strings } from "@/data/strings.ko";

export type NotificationType = "signal" | "event" | "strategy" | "warning";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isHighRisk?: boolean;
}

interface NotificationItemProps {
  item: NotificationData;
  onClick?: (item: NotificationData) => void;
  className?: string;
}

const typeConfig: Record<NotificationType, { icon: LucideIcon; color: string }> = {
  signal: { icon: Activity, color: "bg-primary/10 text-primary" },
  event: { icon: Newspaper, color: "bg-info-weak text-info" },
  strategy: { icon: TrendingUp, color: "bg-success-weak text-success" },
  warning: { icon: AlertTriangle, color: "bg-warning-weak text-warning" },
};

export function NotificationItem({ item, onClick, className }: NotificationItemProps) {
  const Icon = typeConfig[item.type].icon;
  const typeLabel = strings.notification.filters[item.type];

  return (
    <button
      onClick={() => onClick?.(item)}
      className={cn(
        "w-full rounded-lg border border-border bg-card p-4 text-left shadow-sm",
        "transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            typeConfig[item.type].color,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground truncate">{item.title}</p>
            {item.isHighRisk && (
              <span className="rounded-full bg-warning-weak px-2 py-0.5 text-[10px] font-semibold text-warning">
                {strings.notification.highRiskLabel}
              </span>
            )}
          </div>
          <p className="mt-1 text-caption text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          <div className="mt-2 text-[10px] text-muted-foreground">
            {typeLabel} ¡¤ {item.time}
          </div>
        </div>
      </div>
    </button>
  );
}
