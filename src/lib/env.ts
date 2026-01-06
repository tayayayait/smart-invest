const fallbackApiBase = "";
const fallbackNewsProxyPath = "/api/naver-news";
const fallbackFinnhubWsUrl = "wss://ws.finnhub.io";
const fallbackEximApiBase = "https://oapi.koreaexim.go.kr";
const fallbackEximProxyPath = "/api/exchange";
const fallbackYahooProxyPath = "/api/yahoo-chart";
const fallbackYahooQuotePath = "/api/yahoo-quote";

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiBase,
  newsProxyPath: import.meta.env.VITE_NEWS_PROXY_PATH ?? fallbackNewsProxyPath,
  finnhubApiKey: import.meta.env.VITE_FINNHUB_API_KEY ?? "",
  finnhubWsUrl: import.meta.env.VITE_FINNHUB_WS_URL ?? fallbackFinnhubWsUrl,
  eximApiBaseUrl: import.meta.env.VITE_EXIM_API_BASE ?? fallbackEximApiBase,
  eximApiKey: import.meta.env.VITE_EXIM_API_KEY ?? "",
  eximProxyPath: import.meta.env.VITE_EXIM_PROXY_PATH ?? fallbackEximProxyPath,
  yahooProxyPath: import.meta.env.VITE_YAHOO_PROXY_PATH ?? fallbackYahooProxyPath,
  yahooQuotePath: import.meta.env.VITE_YAHOO_QUOTE_PATH ?? fallbackYahooQuotePath,
  alphaApiKey: import.meta.env.VITE_ALPHA_API_KEY ?? "",
} as const;
