export const strings = {
  app: {
    title: "CMI Invest",
  },
  nav: {
    home: "홈",
    portfolio: "포트폴리오",
    signal: "신호",
    journal: "저널",
    profile: "프로필",
  },
  pages: {
    assetDetailTitle: "자산 상세",
    learningLoopTitle: "학습 루프",
    notificationCenterTitle: "알림 센터",
    portfolioTitle: "포트폴리오",
    watchlistTitle: "워치리스트",
  },
  assetDetail: {
    chartTitle: "차트",
    cmiPanelTitle: "CMI 패널",
    cmiScoreLabel: "CMI 점수",
    evidenceTitle: "근거",
    scenarioTitle: "시나리오",
    strategyTitle: "전략 제안",
    detailReasonLabel: "상세 이유 보기",
    newsLoading: "뉴스 불러오는 중...",
    newsEmpty: "표시할 뉴스가 없습니다.",
    range: {
      day: "1일",
      week: "1주",
      month: "1달",
    },
    placeholders: {
      candlestick: "캔들 차트",
      volume: "거래량",
      fan: "팬차트",
    },
    actions: {
      buy: "매수",
      sell: "매도",
      rebalance: "리밸런싱 추가",
      journal: "저널 기록",
    },
  },
  learningLoop: {
    journalTitle: "의사결정 저널",
    replayTitle: "리플레이",
    fields: {
      hypothesis: "가설",
      evidence: "근거",
      choice: "선택",
      risk: "리스크",
      result: "결과",
    },
    placeholders: {
      hypothesis: "예: 금리 인하가 기술주에 호재감으로 작용할 것",
      evidence: "근거가 되는 데이터나 뉴스를 적어 주세요",
      result: "사후 결과를 적어 주세요",
    },
    choiceOptions: {
      buy: "매수",
      sell: "매도",
      hold: "보유",
      watch: "관망",
    },
    riskOptions: {
      low: "저위험",
      medium: "중위험",
      high: "고위험",
    },
    replay: {
      dateLabel: "과거 날짜 선택",
      cmi: "CMI 복원",
      portfolio: "포트폴리오 복원",
      ai: "AI 권고 복원",
    },
  },
  common: {
    viewAll: "전체보기",
    placeholder: "화면 준비 중",
  },
  home: {
    cmiSummaryTitle: "오늘의 CMI 요약",
    portfolioImpactTitle: "포트폴리오 영향",
    riskAssetsTitle: "? 위험도 상승 종목",
    nextActionsTitle: "해야 할 일",
    nextActionsSubtitle: "우선순위 높은 액션",
    exchangeRateLabel: "KRW/USD 매매기준율",
    exchangeRateFallback: "환율 정보를 불러올 수 없습니다.",
    stockSearchTitle: "주식 검색",
    stockSearchPlaceholder: "종목명 또는 티커 입력",
    stockSearchEmpty: "검색 결과가 없습니다.",
    stockSearchNoKey: "API 키가 없어 검색을 사용할 수 없습니다.",
    stockSearchLoading: "검색 중...",
  },
  priority: {
    high: "높음",
    medium: "중간",
    low: "낮음",
  },
  compliance: {
    warningTitle: "고위험 권고",
    warningDesc: "신중한 판단이 필요합니다.",
    disclaimerInfo: "본 정보는 투자 판단을 위한 참고용이며 투자 조언이 아닙니다.",
    disclaimerPrediction: "예측은 과거 데이터에 기반하며 미래 결과를 보장하지 않습니다.",
    sourcePattern: "(출처: {source})",
  },
  notification: {
    filters: {
      all: "전체",
      signal: "신호",
      event: "이벤트",
      strategy: "전략",
      warning: "경고",
    },
    searchPlaceholder: "알림 검색",
    highRiskBannerTitle: "고위험 알림",
    highRiskBannerDesc: "중요한 경고가 있습니다. 신중히 확인하세요.",
    highRiskLabel: "고위험",
    empty: "표시할 알림이 없습니다.",
    doubleConfirm: {
      step1Title: "고위험 알림 확인",
      step1Desc: "이 알림은 투자 판단에 중대한 영향을 줄 수 있습니다.",
      step2Title: "최종 확인",
      step2Desc: "상세를 확인하면 실제 행동으로 이어질 수 있습니다. 진행하시겠습니까?",
      nextButton: "다음",
      confirmButton: "최종 확인",
      cancelButton: "취소",
    },
    mock: [
      {
        id: "n1",
        type: "signal",
        title: "CMI 강한 신호 감지",
        description: "반도체 섹터 중심으로 모멘텀이 강화되고 있습니다.",
        time: "오늘 10:15",
      },
      {
        id: "n2",
        type: "warning",
        title: "고위험 변동성 경고",
        description: "단기 변동성이 급증했습니다. 리스크 관리가 필요합니다.",
        time: "오늘 09:40",
        isHighRisk: true,
      },
      {
        id: "n3",
        type: "strategy",
        title: "전략 업데이트",
        description: "현금 비중 확대 전략이 제안되었습니다.",
        time: "어제 18:30",
      },
      {
        id: "n4",
        type: "event",
        title: "실적 발표 예정",
        description: "이번 주 주요 IT 기업 실적 발표 일정이 있습니다.",
        time: "2025-01-04",
      },
    ],
  },
  ai: {
    detailTitle: "AI 분석 상세",
    sections: {
      signal: "신호",
      interpretation: "해석",
      strategy: "전략 제안",
      action: "행동",
    },
    explainLink: "왜 이런 제안을 했나요?",
    sourceLabel: "출처",
    logButton: "로그 남기기",
    executeButton: "전략 실행",
    newsLoading: "뉴스 불러오는 중...",
    newsEmpty: "표시할 뉴스가 없습니다.",
    scenario: {
      optimistic: "낙관",
      neutral: "중립",
      pessimistic: "비관",
    },
  },
  cmiBadge: {
    levelLabels: {
      low: "약함",
      medium: "보통",
      high: "강함",
    },
  },
  strategy: {
    expectedReturnLabel: "예상 수익",
    riskLabel: "리스크",
    riskLevels: {
      low: "저위험",
      medium: "중위험",
      high: "고위험",
    },
    selectButton: "전략 선택",
    selectedButton: "선택됨",
  },
  asset: {
    holdingsLabel: "보유",
    holdingsUnit: "주",
    liveLabel: "실시간",
    delayedLabel: "지연",
  },
  toast: {
    notificationsTitle: "알림 센터",
    notificationsDesc: "새로운 알림이 3개 있습니다.",
    assetDetailDesc: "자산 상세 페이지로 이동합니다.",
    actionFallbackTitle: "액션",
    actionFallbackDesc: "해당 기능으로 이동합니다.",
    journalTitle: "저널 기록",
    journalDesc: "의사결정 저널 작성 페이지로 이동합니다.",
    explainTitle: "설명",
    explainDesc: "AI 분석 근거를 확인합니다.",
  },
  locale: {
    kst: "KST",
  },
  format: {
    updateStamp: (time: string) => `업데이트: ${time} KST`,
    percentSuffix: "%",
    confidence: (value: number) => `신뢰도 ${value}%`,
    impact: (value: number) => `영향도 ${value}/10`,
    holdings: (value: number) => `보유 ${value}주`,
    relativeTime: {
      justNow: "방금 전",
      minutes: (value: number) => `${value}분 전`,
      hours: (value: number) => `${value}시간 전`,
      yesterday: "어제",
      days: (value: number) => `${value}일 전`,
    },
  },
  currency: {
    krwSymbol: "₩",
    usdSymbol: "$",
  },
  mock: {
    cmi: {
      summary:
        "시장 전반적으로 상승 모멘텀이 감지됩니다. 반도체 섹터 강세가 지속되며 금리 인하 기대감이 반영되고 있습니다.",
      keywords: ["반도체강세", "금리인하", "실적시즌"],
    },
    portfolioAssets: {
      samsung: {
        symbol: "삼성전자",
        name: "Samsung Electronics",
      },
      nvidia: {
        symbol: "NVDA",
        name: "NVIDIA Corp",
      },
      kakao: {
        symbol: "카카오",
        name: "Kakao Corp",
      },
      lgEnergy: {
        symbol: "LG에너지솔루션",
        name: "LG Energy Solution",
      },
    },
    actions: {
      rebalance: {
        title: "리밸런싱 검토 필요",
        description: "IT 섹터 비중이 목표 대비 15% 초과",
      },
      journal: {
        title: "지정매도 결과 기록",
        description: "TSMC 매도 차익 실현 기록하기",
      },
      watch: {
        title: "신규 편입 후보 검토",
        description: "AI 관련 ETF 3종목 분석 예정",
      },
    },
    ai: {
      signalSummary:
        "강한 상승 신호가 감지되었습니다. 주요 지표들이 긍정적인 방향을 가리키고 있습니다.",
      interpretation:
        "미국 연준 금리 동결 소식과 함께 반도체 수요 회복 신호가 관측되었습니다. 특히 AI 관련 기업들의 실적 발표가 예상치를 상회하면서 기술주 중심의 상승이 이어지고 있습니다.",
      evidences: [
        {
          title: "미국, 금리 동결 발표... 증시 반등 기대",
          source: "Naver",
        },
        {
          title: "반도체 PMI 지표 3개월 연속 상승",
          source: "Naver",
        },
        {
          title: "NVIDIA 분기 실적, 예상치 30% 상회",
          source: "Naver",
        },
      ],
      strategies: {
        hold: {
          title: "현재 유지 전략",
          description: "현재 포트폴리오 구성 유지하며 시장 흐름 관찰",
        },
        addTech: {
          title: "기술주 비중 확대",
          description: "반도체·AI 관련 종목 10% 추가 매수",
        },
      },
    },
  },
} as const;



