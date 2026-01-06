import { cn } from "@/lib/utils";
import { Home, PieChart, Activity, BookOpen, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { strings } from "@/data/strings.ko";

type NavItem = "home" | "portfolio" | "signal" | "journal" | "profile";

interface BottomNavProps {
  className?: string;
}

const navItems: { id: NavItem; label: string; icon: typeof Home; path: string }[] = [
  { id: "home", label: strings.nav.home, icon: Home, path: "/" },
  { id: "portfolio", label: strings.nav.portfolio, icon: PieChart, path: "/portfolio" },
  { id: "signal", label: strings.nav.signal, icon: Activity, path: "/asset" },
  { id: "journal", label: strings.nav.journal, icon: BookOpen, path: "/learning-loop" },
  { id: "profile", label: strings.nav.profile, icon: User, path: "/profile" },
];

export function BottomNav({ className }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Simple active check: is the current pathname exactly the item path?
  // For home '/', strictly match. For others, maybe specific logic if subroutes exist.
  // For 'signal' (/asset), we might want to highlight it even if at /asset/NVDA.
  // Let's improve matching logic.

  const getActiveItem = (): NavItem => {
    const p = location.pathname;
    if (p === "/") return "home";
    if (p.startsWith("/portfolio")) return "portfolio";
    if (p.startsWith("/asset")) return "signal";
    if (p.startsWith("/learning-loop")) return "journal";
    if (p.startsWith("/profile")) return "profile";
    return "home"; // Default fallback (or maybe null/none)
  };

  const active = getActiveItem();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom",
        className,
      )}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
              }}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 min-w-[64px] rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn("h-5 w-5 transition-transform", isActive && "scale-110")}
              />
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

