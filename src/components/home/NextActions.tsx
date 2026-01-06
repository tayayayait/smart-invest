import { SectionHeader } from "../ui/SectionHeader";
import { ActionCard } from "../ui/ActionCard";
import { Zap, RefreshCcw, Eye, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { strings } from "@/data/strings.ko";

interface Action {
  id: string;
  type: "rebalance" | "watch" | "journal" | "alert";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface NextActionsProps {
  actions: Action[];
  onActionClick?: (actionId: string) => void;
}

const actionIcons = {
  rebalance: RefreshCcw,
  watch: Eye,
  journal: BookMarked,
  alert: Zap,
};

const actionColors = {
  high: "error" as const,
  medium: "warning" as const,
  low: "info" as const,
};

const priorityStyles: Record<Action["priority"], string> = {
  high: "bg-error-weak text-error",
  medium: "bg-warning-weak text-warning",
  low: "bg-info-weak text-info",
};

const actionRoutes: Record<Action["type"], string> = {
  rebalance: "/asset",
  watch: "/asset",
  journal: "/learning-loop",
  alert: "/notifications",
};

export function NextActions({ actions, onActionClick }: NextActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in-up stagger-3">
      <SectionHeader
        icon={Zap}
        title={strings.home.nextActionsTitle}
        subtitle={strings.home.nextActionsSubtitle}
      />

      <div className="space-y-2">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            icon={actionIcons[action.type]}
            iconColor={actionColors[action.priority]}
            title={action.title}
            description={action.description}
            badge={
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  priorityStyles[action.priority],
                )}
              >
                {strings.priority[action.priority]}
              </span>
            }
            onClick={() => {
              onActionClick?.(action.id);
              navigate(actionRoutes[action.type]);
            }}
          />
        ))}
      </div>
    </div>
  );
}
