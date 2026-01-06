import { useQuery } from "@tanstack/react-query";
import { fetchQuote as fetchFinnhubQuote } from "@/api/finnhub";
import { fetchYahooQuote, UnifiedQuote } from "@/api/yahoo";
import { fetchAlphaQuote, type AlphaQuote } from "@/api/alphaVantage";
import { env } from "@/lib/env";

const koreanSymbolPattern = /\.(KS|KQ)$/i;

const isKoreanSymbol = (symbol?: string) => {
  if (!symbol) return false;
  return koreanSymbolPattern.test(symbol);
};

const parseAlphaNumber = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseAlphaPercent = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.replace(/,/g, "").replace("%", "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseAlphaTimestamp = (value?: string) => {
  if (!value) return Math.floor(Date.now() / 1000);
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : Math.floor(Date.now() / 1000);
};

const mapAlphaToUnified = (quote: AlphaQuote): UnifiedQuote | null => {
  const price = parseAlphaNumber(quote["05. price"]);
  if (price === undefined) return null;

  const previousClose = parseAlphaNumber(quote["08. previous close"]) ?? price;
  const open = parseAlphaNumber(quote["02. open"]) ?? price;
  const high = parseAlphaNumber(quote["03. high"]) ?? price;
  const low = parseAlphaNumber(quote["04. low"]) ?? price;
  const change = parseAlphaNumber(quote["09. change"]);
  const changePercent = parseAlphaPercent(quote["10. change percent"]);
  const timestamp = parseAlphaTimestamp(quote["07. latest trading day"]);

  const computedChange = Number.isFinite(change ?? NaN) ? (change as number) : price - previousClose;
  const computedPercent =
    Number.isFinite(changePercent ?? NaN) && changePercent !== undefined
      ? changePercent
      : previousClose !== 0
      ? (computedChange / previousClose) * 100
      : 0;

  return {
    c: price,
    d: computedChange,
    dp: computedPercent,
    h: high,
    l: low,
    o: open,
    pc: previousClose,
    t: timestamp,
    source: "alpha",
  };
};

const tryAlphaQuote = async (symbol: string) => {
  if (!env.alphaApiKey) return null;
  try {
    const alpha = await fetchAlphaQuote(symbol);
    if (!alpha) return null;
    return mapAlphaToUnified(alpha);
  } catch {
    return null;
  }
};

export function useQuote(symbol?: string) {
  const enabled =
    Boolean(symbol) &&
    (Boolean(env.finnhubApiKey) || Boolean(env.yahooQuotePath) || Boolean(env.alphaApiKey));

  const query = useQuery({
    queryKey: ["quote", symbol],
    queryFn: async () => {
      const target = symbol ?? "";
      if (!target) return null;

      const shouldSkipFinnhub = isKoreanSymbol(target);
      if (env.finnhubApiKey && !shouldSkipFinnhub) {
        try {
          const resp = await fetchFinnhubQuote(target);
          return { ...resp, source: "finnhub" as const };
        } catch {
          // swallow and try Yahoo next
        }
      }

      if (env.alphaApiKey) {
        return await tryAlphaQuote(target);
      }

      try {
        return await fetchYahooQuote(target);
      } catch {
        return null;
      }
    },
    enabled,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  return {
    quote: query.data,
    isLoading: query.isLoading,
    isError: query.isError || (!enabled && !query.isLoading),
    error: query.error,
    isEnabled: enabled,
  };
}
