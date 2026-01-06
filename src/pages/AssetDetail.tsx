import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { AssetChartPanel } from "@/components/asset/AssetChartPanel";
import { CMIPanel } from "@/components/asset/CMIPanel";
import { StrategySuggestions } from "@/components/asset/StrategySuggestions";
import { ActionBar } from "@/components/asset/ActionBar";
import { WarningBanner } from "@/components/compliance/WarningBanner";
import { DisclaimerFooter } from "@/components/compliance/DisclaimerFooter";
import { SourceAttribution } from "@/components/compliance/SourceAttribution";
import { strings } from "@/data/strings.ko";
import { useParams } from "react-router-dom";
import { useNews } from "@/hooks/useNews";

import { mockCMI_Asset, mockStrategies_Asset } from "@/lib/assetData";

export const AssetDetail = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>();
  const { toast } = useToast();
  const params = useParams();
  const symbolParam = params.symbol ?? strings.mock.portfolioAssets.samsung.symbol;

  const finnhubSymbolMap = {
    [strings.mock.portfolioAssets.samsung.symbol]: "005930.KS",
    [strings.mock.portfolioAssets.kakao.symbol]: "035720.KS",
    [strings.mock.portfolioAssets.lgEnergy.symbol]: "373220.KS",
    [strings.mock.portfolioAssets.nvidia.symbol]: "NVDA",
  } as const;

  const chartSymbol =
    finnhubSymbolMap[symbolParam as keyof typeof finnhubSymbolMap] ?? symbolParam;

  const assetName = useMemo(() => {
    const assets = Object.values(strings.mock.portfolioAssets);
    const match = assets.find(
      (asset) => asset.symbol === symbolParam || asset.name === symbolParam,
    );
    return match?.name;
  }, [symbolParam]);

  const newsQuery = assetName ? `${assetName} OR ${symbolParam}` : symbolParam;
  const news = useNews(newsQuery, 3);
  const newsEvidences = news.items.slice(0, 3).map((item) => ({
    type: "news" as const,
    title: item.title,
    source: "Naver",
  }));

  const evidences = newsEvidences;

  return (
    <>
      <MobileHeader title={strings.pages.assetDetailTitle} />

      <main className="px-4 py-4 space-y-6 pb-32">
        <WarningBanner
          title={strings.compliance.warningTitle}
          description={strings.compliance.warningDesc}
        />

        <AssetChartPanel symbol={chartSymbol} />
        <CMIPanel
          cmi={mockCMI_Asset.cmi}
          confidence={mockCMI_Asset.confidence}
          summary={mockCMI_Asset.summary}
          evidences={evidences}
          isNewsLoading={news.isLoading}
        />
        {newsEvidences.length > 0 && (
          <SourceAttribution
            source={strings.compliance.sourcePattern.replace("{source}", "Naver 뉴스")}
          />
        )}
        <StrategySuggestions
          strategies={mockStrategies_Asset}
          selectedId={selectedStrategy}
          onSelect={setSelectedStrategy}
          onDetails={(id) =>
            toast({
              title: strings.ai.explainLink,
              description: `${id} · ${strings.assetDetail.detailReasonLabel}`,
            })
          }
        />

        <DisclaimerFooter
          primary={strings.compliance.disclaimerInfo}
          secondary={strings.compliance.disclaimerPrediction}
        />
      </main>

      <ActionBar
        onBuy={() =>
          toast({
            title: strings.assetDetail.actions.buy,
            description: strings.common.placeholder,
          })
        }
        onSell={() =>
          toast({
            title: strings.assetDetail.actions.sell,
            description: strings.common.placeholder,
          })
        }
        onRebalance={() =>
          toast({
            title: strings.assetDetail.actions.rebalance,
            description: strings.common.placeholder,
          })
        }
        onJournal={() =>
          toast({
            title: strings.assetDetail.actions.journal,
            description: strings.common.placeholder,
          })
        }
      />
    </>
  );
};

// export default AssetDetail;











