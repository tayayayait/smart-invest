import { useQuery } from "@tanstack/react-query";
import { fetchCandles as fetchFinnhubCandles } from "@/api/finnhub";
import { fetchYahooCandles, type CandleResponse } from "@/api/yahoo";
import { fetchAlphaDaily, type AlphaTimeseries } from "@/api/alphaVantage";
import { env } from "@/lib/env";

type Range = "day" | "week" | "month";

const getRangeConfig = (range: Range) => {
  const now = Math.floor(Date.now() / 1000);
  switch (range) {
    case "day":
      return { resolution: "30", from: now - 60 * 60 * 24, to: now };
    case "week":
      return { resolution: "60", from: now - 60 * 60 * 24 * 7, to: now };
    case "month":
    default:
      return { resolution: "D", from: now - 60 * 60 * 24 * 30, to: now };
  }
};

const alphaRangeCount: Record<Range, number> = {
  day: 5,
  week: 10,
  month: 22,
};

const buildAlphaCandles = (
  symbol: string,
  range: Range,
  data: Record<string, AlphaTimeseries>,
): CandleResponse => {
  const entries = Object.entries(data);
  const sorted = entries
    .map(([date, values]) => ({ date, time: Date.parse(date), values }))
    .sort((a, b) => a.time - b.time);

  const slice = sorted.slice(-alphaRangeCount[range]);

  const candles: CandleResponse = {
    c: [],
    h: [],
    l: [],
    o: [],
    v: [],
    t: [],
    s: slice.length > 0 ? "ok" : "no_data",
  };
  slice.forEach(({ time, values }) => {
    candles.t.push(Math.floor(time / 1000));
    candles.c.push(values.close);
    candles.o.push(values.open);
    candles.h.push(values.high);
    candles.l.push(values.low);
    candles.v.push(values.volume);
  });

  return candles;
};

export function useCandles(symbol?: string, range: Range = "week") {
  const enabled = Boolean(symbol);
  const { resolution, from, to } = getRangeConfig(range);

  const query = useQuery({
    queryKey: ["candles", symbol, range],
    queryFn: async () => {
      const target = symbol ?? "";

      if (env.finnhubApiKey) {
        try {
          const finnhub = await fetchFinnhubCandles({
            symbol: target,
            resolution,
            from,
            to,
          });
          if (finnhub?.s === "ok" && finnhub.t?.length) {
            return finnhub;
          }
        } catch {
          // fall back
        }
      }

      if (env.alphaApiKey) {
        try {
          const alpha = await fetchAlphaDaily(target);
          if (Object.keys(alpha).length > 0) {
            return buildAlphaCandles(target, range, alpha);
          }
        } catch {
          // fall back to Yahoo if Alpha fails
        }
      }

      try {
        return await fetchYahooCandles(target, range);
      } catch {
        const empty: CandleResponse = { c: [], h: [], l: [], o: [], v: [], t: [], s: "no_data" };
        return empty;
      }
    },
    enabled,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isEnabled: enabled,
  };
}
