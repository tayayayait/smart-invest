import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { NotificationFilter } from "@/components/notification/NotificationFilter";
import { NotificationList } from "@/components/notification/NotificationList";
import type { NotificationData, NotificationType } from "@/components/notification/NotificationItem";
import { WarningBanner } from "@/components/compliance/WarningBanner";
import { DisclaimerFooter } from "@/components/compliance/DisclaimerFooter";
import { SourceAttribution } from "@/components/compliance/SourceAttribution";
import { DoubleConfirmDialog } from "@/components/ui/DoubleConfirmDialog";
import { strings } from "@/data/strings.ko";

const mockNotifications: NotificationData[] = strings.notification.mock.map((item) => ({
  id: item.id,
  type: item.type,
  title: item.title,
  description: item.description,
  time: item.time,
  isHighRisk: "isHighRisk" in item ? item.isHighRisk : undefined,
}));

const routeByType: Record<NotificationType, string> = {
  signal: "/asset/NVDA", // Demo: Signal points to Nvidia
  event: "/asset/Samsung", // Demo: Event points to Samsung
  strategy: "/portfolio", // Strategy might make more sense on Portfolio page
  warning: "/asset/Samsung", // Warning points to Samsung
};

const NotificationCenter = () => {
  const [selectedType, setSelectedType] = useState<"all" | NotificationType>("all");
  const [query, setQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<NotificationData | null>(null);
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    return mockNotifications.filter((item) => {
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesQuery =
        query.trim().length === 0 ||
        item.title.includes(query) ||
        item.description.includes(query);
      return matchesType && matchesQuery;
    });
  }, [query, selectedType]);

  const hasHighRisk = filteredItems.some((item) => item.isHighRisk);

  const handleNavigate = (item: NotificationData) => {
    navigate(routeByType[item.type]);
  };

  const handleItemClick = (item: NotificationData) => {
    if (item.isHighRisk) {
      setPendingItem(item);
      setConfirmOpen(true);
      return;
    }

    handleNavigate(item);
  };

  const handleDialogChange = (open: boolean) => {
    setConfirmOpen(open);
    if (!open) {
      setPendingItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title={strings.pages.notificationCenterTitle} />
      <main className="px-4 py-4 space-y-5">
        <NotificationFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          query={query}
          onQueryChange={setQuery}
        />

        {hasHighRisk && (
          <WarningBanner
            title={strings.notification.highRiskBannerTitle}
            description={strings.notification.highRiskBannerDesc}
          />
        )}

        <NotificationList items={filteredItems} onItemClick={handleItemClick} />

        <SourceAttribution source={strings.compliance.sourcePattern.replace("{source}", "DART 2025-01-04")} />
        <DisclaimerFooter
          primary={strings.compliance.disclaimerInfo}
          secondary={strings.compliance.disclaimerPrediction}
        />
      </main>

      <DoubleConfirmDialog
        open={confirmOpen}
        onOpenChange={handleDialogChange}
        onConfirm={() => {
          if (pendingItem) {
            handleNavigate(pendingItem);
          }
          handleDialogChange(false);
        }}
        step1Title={strings.notification.doubleConfirm.step1Title}
        step1Description={strings.notification.doubleConfirm.step1Desc}
        step2Title={strings.notification.doubleConfirm.step2Title}
        step2Description={strings.notification.doubleConfirm.step2Desc}
        nextLabel={strings.notification.doubleConfirm.nextButton}
        confirmLabel={strings.notification.doubleConfirm.confirmButton}
        cancelLabel={strings.notification.doubleConfirm.cancelButton}
      />
    </div>
  );
};

export default NotificationCenter;
