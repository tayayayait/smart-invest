import { NotificationItem, NotificationData } from "./NotificationItem";
import { strings } from "@/data/strings.ko";

interface NotificationListProps {
  items: NotificationData[];
  onItemClick?: (item: NotificationData) => void;
}

export function NotificationList({ items, onItemClick }: NotificationListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-caption text-muted-foreground">
        {strings.notification.empty}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <NotificationItem key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
