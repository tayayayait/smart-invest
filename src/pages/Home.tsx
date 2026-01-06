import { useState } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { CMISummary } from "@/components/home/CMISummary";
import { PortfolioImpact } from "@/components/home/PortfolioImpact";
import { NextActions } from "@/components/home/NextActions";
import { StockSearch } from "@/components/home/StockSearch";
import { AIResponseContainer } from "@/components/ai/AIResponseContainer";
import { WarningBanner } from "@/components/compliance/WarningBanner";
import { DisclaimerFooter } from "@/components/compliance/DisclaimerFooter";
import { SourceAttribution } from "@/components/compliance/SourceAttribution";
import { useToast } from "@/hooks/use-toast";
import { strings } from "@/data/strings.ko";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { formatExchangeRate } from "@/lib/format";
import { useQuote } from "@/hooks/useQuote";
import { useTradeSocket } from "@/hooks/useTradeSocket";
import { useNews } from "@/hooks/useNews";
import { useNavigate } from "react-router-dom";

import { mockCMI, mockPortfolio, mockActions, mockAIResponse } from "@/lib/mockData";

const Home = () => {
  const navigate = useNavigate();
  const [selectedStrategy, setSelectedStrategy] = useState<string>();
  const { toast } = useToast();
  const exchangeRates = useExchangeRates();
  const aiNewsQuery = "증시 OR 주식";
  const aiNews = useNews(aiNewsQuery, 3);
  const finnhubSymbolMap = {
    [strings.mock.portfolioAssets.nvidia.symbol]: "NVDA",
    [strings.mock.portfolioAssets.samsung.symbol]: "005930.KS",
    [strings.mock.portfolioAssets.kakao.symbol]: "035720.KS",
    [strings.mock.portfolioAssets.lgEnergy.symbol]: "373220.KS",
  } as const;

  const quoteNvda = useQuote(finnhubSymbolMap[strings.mock.portfolioAssets.nvidia.symbol]);
  const quoteSamsung = useQuote(finnhubSymbolMap[strings.mock.portfolioAssets.samsung.symbol]);
  const quoteKakao = useQuote(finnhubSymbolMap[strings.mock.portfolioAssets.kakao.symbol]);
  const quoteLgEnergy = useQuote(finnhubSymbolMap[strings.mock.portfolioAssets.lgEnergy.symbol]);
  const tradeSocket = useTradeSocket(Object.values(finnhubSymbolMap));

  const exchangeRateText = exchangeRates.rate
    ? formatExchangeRate(exchangeRates.rate)
    : undefined;
  const exchangeRateFallback =
    !exchangeRateText && !exchangeRates.isLoading
      ? strings.home.exchangeRateFallback
      : undefined;

  const aiEvidences = aiNews.items.slice(0, 3).map((item, index) => ({
    type: "news" as const,
    title: item.title,
    impact: Math.max(6, 8 - index),
    source: "Naver",
  }));

  const aiResponse = {
    ...mockAIResponse,
    interpretation: {
      ...mockAIResponse.interpretation,
      evidences: aiEvidences,
    },
  };

  const buildLiveOverride = (assetSymbol: string, quoteData: typeof quoteNvda.quote) => {
    const finnhubSymbol = finnhubSymbolMap[assetSymbol as keyof typeof finnhubSymbolMap];
    if (!finnhubSymbol) return undefined;
    const liveTrade = tradeSocket.prices[finnhubSymbol];
    const livePrice = liveTrade?.price;
    const basePrice = quoteData?.c;
    const previousClose = quoteData?.pc;
    const price = livePrice ?? basePrice;
    if (price === undefined || price === null) return undefined;
    if (!livePrice && quoteData && quoteData.t === 0) return undefined;

    const canCalc = previousClose !== undefined && previousClose !== null && previousClose !== 0;
    const change = canCalc ? price - previousClose : quoteData?.d ?? 0;
    const changePercent = canCalc ? (change / previousClose) * 100 : quoteData?.dp ?? 0;

    return {
      price,
      change,
      changePercent,
      isLive: Boolean(livePrice),
    };
  };

  const liveQuoteMap: Record<
    string,
    { price: number; change: number; changePercent: number; isLive?: boolean }
  > = {};
  const nvdaOverride = buildLiveOverride(
    strings.mock.portfolioAssets.nvidia.symbol,
    quoteNvda.quote,
  );
  if (nvdaOverride) {
    liveQuoteMap[strings.mock.portfolioAssets.nvidia.symbol] = nvdaOverride;
  }
  const samsungOverride = buildLiveOverride(
    strings.mock.portfolioAssets.samsung.symbol,
    quoteSamsung.quote,
  );
  if (samsungOverride) {
    liveQuoteMap[strings.mock.portfolioAssets.samsung.symbol] = samsungOverride;
  }
  const kakaoOverride = buildLiveOverride(
    strings.mock.portfolioAssets.kakao.symbol,
    quoteKakao.quote,
  );
  if (kakaoOverride) {
    liveQuoteMap[strings.mock.portfolioAssets.kakao.symbol] = kakaoOverride;
  }
  const lgEnergyOverride = buildLiveOverride(
    strings.mock.portfolioAssets.lgEnergy.symbol,
    quoteLgEnergy.quote,
  );
  if (lgEnergyOverride) {
    liveQuoteMap[strings.mock.portfolioAssets.lgEnergy.symbol] = lgEnergyOverride;
  }

  const handleNotificationClick = () => {
    toast({
      title: strings.toast.notificationsTitle,
      description: strings.toast.notificationsDesc,
    });
  };

  const handleAssetClick = (symbol: string) => {
    toast({
      title: symbol,
      description: strings.toast.assetDetailDesc,
    });
  };

  const handleActionClick = (actionId: string) => {
    const action = mockActions.find((a) => a.id === actionId);
    toast({
      title: action?.title || strings.toast.actionFallbackTitle,
      description: strings.toast.actionFallbackDesc,
    });
  };

  const handleLogAction = () => {
    toast({
      title: strings.toast.journalTitle,
      description: strings.toast.journalDesc,
    });
  };

  return (
    <>
      <MobileHeader
        title={strings.app.title}
        notificationCount={3}
        onNotificationClick={handleNotificationClick}
      />

      <main className="px-4 py-4 space-y-6">
        <WarningBanner
          title={strings.compliance.warningTitle}
          description={strings.compliance.warningDesc}
        />

        <StockSearch />

        {/* CMI Summary */}
        <CMISummary
          {...mockCMI}
          exchangeRateLabel={strings.home.exchangeRateLabel}
          exchangeRateText={exchangeRateText}
          exchangeRateFallback={exchangeRateFallback}
        />

        {/* Portfolio Impact */}
        <PortfolioImpact
          {...mockPortfolio}
          quoteMap={liveQuoteMap}
          onAssetClick={handleAssetClick}
          onViewAll={() => navigate("/portfolio")}
        />

        {/* Next Best Actions */}
        <NextActions actions={mockActions} onActionClick={handleActionClick} />

        {/* AI Response Container (Signal Detail View) */}
        <div className="pt-2 space-y-3">
          <h2 className="text-h2 font-bold text-foreground">{strings.ai.detailTitle}</h2>
          <AIResponseContainer
            {...aiResponse}
            selectedStrategy={selectedStrategy}
            onStrategySelect={setSelectedStrategy}
            onLogAction={handleLogAction}
            onExplain={() =>
              toast({
                title: strings.toast.explainTitle,
                description: strings.toast.explainDesc,
              })
            }
            isEvidenceLoading={aiNews.isLoading}
          />
          {aiEvidences.length > 0 && (
            <SourceAttribution
              source={strings.compliance.sourcePattern.replace("{source}", "Naver 뉴스")}
            />
          )}
        </div>

        <DisclaimerFooter
          primary={strings.compliance.disclaimerInfo}
          secondary={strings.compliance.disclaimerPrediction}
        />
      </main>
    </>
  );
};

export default Home;
