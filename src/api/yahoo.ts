import { env } from "@/lib/env";

export type CandleResponse = {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  v: number[];
  t: number[];
  s: "ok" | "no_data";
};

type QuoteItem = {
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
  symbol: string;
};

type YahooQuoteResponse = {
  quoteResponse?: {
    result?: QuoteItem[];
    error?: { code?: string; description?: string } | null;
  };
};

export type UnifiedQuoteSource = "yahoo" | "finnhub" | "alpha";

export type UnifiedQuote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
  source: UnifiedQuoteSource;
};

type Range = "day" | "week" | "month";

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          close?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
    error?: { code?: string; description?: string } | null;
  };
};

const joinUrl = (base: string, path: string) => {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  if (!trimmedBase) return `/${trimmedPath}`;
  return `${trimmedBase}/${trimmedPath}`;
};

const getRangeParams = (range: Range) => {
  switch (range) {
    case "day":
      return { range: "1d", interval: "5m" };
    case "week":
      return { range: "5d", interval: "30m" };
    case "month":
    default:
      return { range: "1mo", interval: "1d" };
  }
};

export async function fetchYahooCandles(symbol: string, range: Range): Promise<CandleResponse> {
  if (!symbol) {
    return { c: [], h: [], l: [], o: [], v: [], t: [], s: "no_data" };
  }

  const { range: rangeParam, interval } = getRangeParams(range);
  const base = joinUrl(env.apiBaseUrl ?? "", env.yahooProxyPath);
  const path = `${base}/${encodeURIComponent(symbol)}?range=${encodeURIComponent(
    rangeParam,
  )}&interval=${encodeURIComponent(interval)}`;
  const url = base.startsWith("http") ? new URL(path).toString() : path;

  const headers = {
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    referer: "https://finance.yahoo.com/",
    origin: "https://finance.yahoo.com",
  };
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Yahoo candles error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as YahooChartResponse;
  if (json.chart?.error) {
    return { c: [], h: [], l: [], o: [], v: [], t: [], s: "no_data" };
  }

  const result = json.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const quote = result?.indicators?.quote?.[0];
  if (!quote || timestamps.length === 0) {
    return { c: [], h: [], l: [], o: [], v: [], t: [], s: "no_data" };
  }

  const c: number[] = [];
  const h: number[] = [];
  const l: number[] = [];
  const o: number[] = [];
  const v: number[] = [];
  const t: number[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    const close = quote.close?.[i];
    if (close === null || close === undefined || !Number.isFinite(close)) continue;

    const open = quote.open?.[i];
    const high = quote.high?.[i];
    const low = quote.low?.[i];
    const volume = quote.volume?.[i];

    t.push(timestamps[i]);
    c.push(close);
    o.push(open === null || open === undefined ? close : open);
    h.push(high === null || high === undefined ? close : high);
    l.push(low === null || low === undefined ? close : low);
    v.push(volume === null || volume === undefined ? 0 : volume);
  }

  return {
    c,
    h,
    l,
    o,
    v,
    t,
    s: t.length > 0 ? "ok" : "no_data",
  };
}

export async function fetchYahooQuote(symbol: string): Promise<UnifiedQuote | null> {
  if (!symbol) return null;

  const base = joinUrl(env.apiBaseUrl ?? "", env.yahooQuotePath);
  const url = base.startsWith("http")
    ? new URL(`${base}?symbols=${encodeURIComponent(symbol)}`).toString()
    : `${base}?symbols=${encodeURIComponent(symbol)}`;

  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
  const headers = {
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    referer: "https://finance.yahoo.com/",
    origin: "https://finance.yahoo.com",
  };
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`Yahoo quote error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as YahooQuoteResponse;
  const item = json.quoteResponse?.result?.[0];
  if (!item || Number.isNaN(item.regularMarketPrice ?? NaN)) {
    return null;
  }

  const current = item.regularMarketPrice ?? 0;
  const previousClose = item.regularMarketPreviousClose ?? current;
  const change = item.regularMarketChange ?? current - previousClose;
  const changePercent =
    item.regularMarketChangePercent ??
    (previousClose !== 0 ? (change / previousClose) * 100 : 0);
  const high = item.regularMarketDayHigh ?? current;
  const low = item.regularMarketDayLow ?? current;
  const open = item.regularMarketOpen ?? current;
  const timestamp = item.regularMarketTime ?? Math.floor(Date.now() / 1000);

  return {
    c: current,
    d: change,
    dp: changePercent,
    h: high,
    l: low,
    o: open,
    pc: previousClose,
    t: timestamp,
    source: "yahoo",
  };
}
