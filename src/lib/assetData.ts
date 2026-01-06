
import { strings } from "@/data/strings.ko";

export const mockCMI_Asset = {
    cmi: 74,
    confidence: 82,
    summary: strings.mock.ai.signalSummary,
    evidences: [
        {
            title: strings.mock.ai.evidences[0].title,
            impact: 8,
            source: strings.mock.ai.evidences[0].source,
        },
        {
            title: strings.mock.ai.evidences[1].title,
            impact: 7,
            source: strings.mock.ai.evidences[1].source,
        },
    ],
};

export const mockStrategies_Asset = [
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
];
