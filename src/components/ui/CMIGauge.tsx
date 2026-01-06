
import { cn } from "@/lib/utils";

interface CMIGaugeProps {
    value: number; // 0-100
    className?: string;
}

export function CMIGauge({ value, className }: CMIGaugeProps) {
    // SVG configuration
    const radius = 80;
    const stroke = 12;
    const normalizedValue = Math.min(100, Math.max(0, value));
    const circumference = normalizedValue * 1.8; // semi-circleish usage

    // Create a semi-circle gauge (180 degrees)
    // Or actually, a C-shape (220 degrees) is more modern.
    // Let's do a simple 180 degree semi-circle for stability.

    // Circle math
    // Arc length = (Angle/360) * 2 * PI * r
    // We want 180 degrees (half circle).
    const fullCircumference = 2 * Math.PI * radius;
    const offset = fullCircumference - (normalizedValue / 100) * (fullCircumference / 2);

    // Angle for needle
    const angle = (normalizedValue / 100) * 180 - 90;

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className)}>
            <svg
                width="200"
                height="110"
                viewBox="0 0 200 110"
                className="overflow-visible"
            >
                {/* Background Track */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />

                {/* Value Track (Gradient) */}
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--cmi-0))" /> {/* Fear */}
                        <stop offset="50%" stopColor="hsl(var(--cmi-50))" /> {/* Neutral */}
                        <stop offset="100%" stopColor="hsl(var(--cmi-100))" /> {/* Greed */}
                    </linearGradient>
                </defs>

                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={fullCircumference / 2} // Half circle length
                    strokeDashoffset={fullCircumference / 2 - (normalizedValue / 100) * (fullCircumference / 2)}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Score Text */}
            <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-4xl font-bold tracking-tighter tabular-nums text-foreground animate-in fade-in zoom-in duration-700">
                    {value}
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                    CMI Score
                </span>
            </div>
        </div>
    );
}
