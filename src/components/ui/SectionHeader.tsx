import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <div>
          <h2 className="text-h3 text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-caption text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1 text-caption text-primary hover:text-primary/80 transition-colors"
        >
          {action.label}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
