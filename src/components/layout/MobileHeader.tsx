import { cn } from "@/lib/utils";
import { Bell, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface MobileHeaderProps {
  title?: string;
  showNotifications?: boolean;
  showSearch?: boolean;
  showSettings?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export function MobileHeader({
  title = "CMI Invest",
  showNotifications = true,
  showSearch = false,
  showSettings = false,
  notificationCount = 0,
  onNotificationClick,
  onSearchClick,
  onSettingsClick,
  className,
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const handleNotificationClick = () => {
    onNotificationClick?.();
    navigate("/notifications");
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur-sm border-b border-border safe-area-top",
      className
    )}>
      <h1 className="text-h2 font-bold text-foreground">{title}</h1>
      
      <div className="flex items-center gap-1">
        {showSearch && (
          <Button variant="ghost" size="icon" onClick={onSearchClick}>
            <Search className="h-5 w-5" />
          </Button>
        )}
        {showSettings && (
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
          </Button>
        )}
        {showNotifications && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-error-foreground">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
