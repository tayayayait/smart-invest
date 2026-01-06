import { SectionHeader } from "../ui/SectionHeader";
import { AssetListItem } from "../ui/AssetListItem";
import { PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { strings } from "@/data/strings.ko";

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  holdings?: number;
  sparkline?: number[];
}

type QuoteStatus = "live" | "delayed";
type MergedAsset = Asset & { quoteStatus?: QuoteStatus };

interface PortfolioImpactProps {
  topGainers: Asset[];
  topLosers: Asset[];
  riskAssets: Asset[];
  quoteMap?: Record<
    string,
    {
      price: number;
      change: number;
      changePercent: number;
      isLive?: boolean;
    }
  >;
  onAssetClick?: (symbol: string) => void;
  onViewAll?: () => void;
}

export function PortfolioImpact({
  topGainers,
  topLosers,
  riskAssets,
  quoteMap,
  onAssetClick,
  onViewAll,
}: PortfolioImpactProps) {
  const navigate = useNavigate();

  const mergeQuote = (asset: Asset): MergedAsset => {
    const quote = quoteMap?.[asset.symbol];
    if (!quote) return asset;
    const quoteStatus: QuoteStatus = quote.isLive ? "live" : "delayed";
    return {
      ...asset,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      quoteStatus,
    };
  };

  const handleAssetClick = (symbol: string) => {
    onAssetClick?.(symbol);
    navigate(`/asset/${encodeURIComponent(symbol)}`);
  };

  return (
    <div className="animate-fade-in-up stagger-2">
      <SectionHeader
        icon={PieChart}
        title={strings.home.portfolioImpactTitle}
        action={{ label: strings.common.viewAll, onClick: onViewAll || (() => {}) }}
      />

      <div className="space-y-2">
        {topGainers.slice(0, 2).map((asset) => (
          <AssetListItem
            key={asset.symbol}
            {...mergeQuote(asset)}
            onClick={() => handleAssetClick(asset.symbol)}
          />
        ))}
        {topLosers.slice(0, 2).map((asset) => (
          <AssetListItem
            key={asset.symbol}
            {...mergeQuote(asset)}
            onClick={() => handleAssetClick(asset.symbol)}
          />
        ))}
      </div>

      {riskAssets.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-warning-weak border border-warning/30 shadow-sm">
          <p className="text-caption font-medium text-warning mb-2">
            {strings.home.riskAssetsTitle}
          </p>
          <div className="space-y-2">
            {riskAssets.slice(0, 2).map((asset) => (
              <AssetListItem
                key={asset.symbol}
                {...mergeQuote(asset)}
                onClick={() => handleAssetClick(asset.symbol)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
