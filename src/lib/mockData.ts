// Shared mock data for the application
import { strings } from "@/data/strings.ko";

export const mockCMI = {
    cmiValue: 72,
    confidence: 85,
    summary: strings.mock.cmi.summary,
    keywords: strings.mock.cmi.keywords,
    lastUpdated: new Date(),
};

export const mockPortfolio = {
    topGainers: [
        {
            symbol: strings.mock.portfolioAssets.samsung.symbol,
            name: strings.mock.portfolioAssets.samsung.name,
            price: 72800,
            change: 1200,
            changePercent: 1.68,
            holdings: 50,
            sparkline: [70, 71, 70.5, 72, 71.5, 72.8],
        },
        {
            symbol: strings.mock.portfolioAssets.nvidia.symbol,
            name: strings.mock.portfolioAssets.nvidia.name,
            price: 485000,
            change: 12500,
            changePercent: 2.64,
            holdings: 10,
            sparkline: [460, 465, 470, 475, 480, 485],
        },
    ],
    topLosers: [
        {
            symbol: strings.mock.portfolioAssets.kakao.symbol,
            name: strings.mock.portfolioAssets.kakao.name,
            price: 42150,
            change: -850,
            changePercent: -1.98,
            holdings: 30,
            sparkline: [44, 43.5, 43, 42.5, 42.3, 42.1],
        },
    ],
    riskAssets: [
        {
            symbol: strings.mock.portfolioAssets.lgEnergy.symbol,
            name: strings.mock.portfolioAssets.lgEnergy.name,
            price: 385000,
            change: -15000,
            changePercent: -3.75,
            holdings: 5,
            sparkline: [420, 410, 400, 395, 390, 385],
        },
    ],
};

export const mockActions = [
    {
        id: "1",
        type: "rebalance" as const,
        title: strings.mock.actions.rebalance.title,
        description: strings.mock.actions.rebalance.description,
        priority: "high" as const,
    },
    {
        id: "2",
        type: "journal" as const,
        title: strings.mock.actions.journal.title,
        description: strings.mock.actions.journal.description,
        priority: "medium" as const,
    },
    {
        id: "3",
        type: "watch" as const,
        title: strings.mock.actions.watch.title,
        description: strings.mock.actions.watch.description,
        priority: "low" as const,
    },
];

export const mockAIResponse = {
    signal: {
        cmi: 72,
        confidence: 85,
        summary: strings.mock.ai.signalSummary,
    },
    interpretation: {
        analysis: strings.mock.ai.interpretation,
        evidences: [],
    },
    strategies: [
        {
            id: "a",
            title: strings.mock.ai.strategies.hold.title,
            description: strings.mock.ai.strategies.hold.description,
            expectedReturn: "+5~8%",
            risk: "low" as const,
            confidence: 78,
        },
        {
            id: "b",
            title: strings.mock.ai.strategies.addTech.title,
            description: strings.mock.ai.strategies.addTech.description,
            expectedReturn: "+12~18%",
            risk: "medium" as const,
            confidence: 72,
        },
    ],
};


