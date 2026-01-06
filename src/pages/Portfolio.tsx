import { MobileHeader } from "@/components/layout/MobileHeader";
import { strings } from "@/data/strings.ko";
import { mockPortfolio } from "@/lib/mockData";
import { PortfolioImpact } from "@/components/home/PortfolioImpact";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Portfolio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAssetClick = (symbol: string) => {
    toast({
      title: symbol,
      description: strings.toast.assetDetailDesc,
    });
  };

  // For Phase 2, we just want to ensure it's not a placeholder.
  // We reuse the PortfolioImpact component used in Home, or we could create a more detailed view.
  // Given the instruction "Active State: Show the table/charts", reusing PortfolioImpact is a good start.

  const hasAssets = mockPortfolio.topGainers.length > 0 || mockPortfolio.topLosers.length > 0;

  return (
    <>
      <MobileHeader title={strings.pages.portfolioTitle} />
      <main className="px-4 py-6 space-y-6">
        {hasAssets ? (
          <PortfolioImpact
            {...mockPortfolio}
            quoteMap={{}} // Live data not hooked up here yet, fine for now
            onAssetClick={handleAssetClick}
            onViewAll={() => { }} // Already on portfolio page
          />
        ) : (
          <div className="rounded-lg bg-card p-10 text-center text-muted-foreground">
            {strings.common.placeholder}
            <br />
            <span className="text-sm">자산을 추가하여 포트폴리오를 구성해보세요.</span>
          </div>
        )}
      </main>
    </>
  );
};

export default Portfolio;
