import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FinancialCardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  pressable?: boolean;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

export function FinancialCard({
  children,
  header,
  footer,
  pressable = false,
  selected = false,
  className,
  onClick,
}: FinancialCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card p-4 shadow-card",
        pressable && "cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99]",
        selected && "ring-2 ring-primary",
        className
      )}
      onClick={pressable ? onClick : undefined}
    >
      {header && (
        <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
          {header}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          {footer}
        </div>
      )}
    </div>
  );
}

interface FinancialValueProps {
  value: string | number;
  label?: string;
  change?: number;
  changeLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FinancialValue({
  value,
  label,
  change,
  changeLabel,
  size = 'md',
  className,
}: FinancialValueProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  
  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <span className="text-caption text-muted-foreground mb-1">{label}</span>
      )}
      <span className={cn("font-tabular font-bold", sizeClasses[size])}>
        {value}
      </span>
      {change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          <span
            className={cn(
              "font-tabular text-sm font-medium",
              isPositive && "text-success",
              isNegative && "text-error",
              !isPositive && !isNegative && "text-muted-foreground"
            )}
          >
            {isPositive && '+'}
            {change}%
          </span>
          {changeLabel && (
            <span className="text-caption text-muted-foreground">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
