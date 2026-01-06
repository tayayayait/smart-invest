import { cn } from "@/lib/utils";
import { ChevronRight, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ActionCardProps {
  icon?: LucideIcon;
  iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
  badge?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ActionCard({
  icon: Icon,
  iconColor = 'primary',
  title,
  description,
  badge,
  onClick,
  className,
}: ActionCardProps) {
  const iconColorClasses = {
    primary: 'bg-primary-weak text-primary',
    success: 'bg-success-weak text-success',
    warning: 'bg-warning-weak text-warning',
    error: 'bg-error-weak text-error',
    info: 'bg-info-weak text-info',
  };
  
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg bg-card p-4 shadow-card cursor-pointer",
        "transition-all duration-200 hover:shadow-md active:scale-[0.99]",
        className
      )}
      onClick={onClick}
    >
      {Icon && (
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          iconColorClasses[iconColor]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">{title}</span>
          {badge}
        </div>
        {description && (
          <p className="text-caption text-muted-foreground mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </div>
  );
}
