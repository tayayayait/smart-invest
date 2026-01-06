import { env } from "@/lib/env";

const BASE = "https://www.alphavantage.co/query";

type AlphaResponse<T> = {
  readonly [key: string]: T;
};

const buildUrl = (params: Record<string, string>) => {
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
};

const handleError = <T extends Record<string, unknown>>(data: T) => {
  const note = data["Note"];
  const errorMessage = data["Error Message"];
  if (typeof note === "string" || typeof errorMessage === "string") {
    throw new Error(note ?? errorMessage);
  }
  return data;
};

export type AlphaQuote = {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
};

export async function fetchAlphaQuote(symbol: string): Promise<AlphaQuote | null> {
  if (!env.alphaApiKey) return null;

  const url = buildUrl({
    function: "GLOBAL_QUOTE",
    symbol,
    apikey: env.alphaApiKey,
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error("AlphaVantage quote error");
  const data = await res.json();
  if (!data["Global Quote"]) return null;
  return data["Global Quote"] as AlphaQuote;
}

export type AlphaTimeseries = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type AlphaSymbolMatch = {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
};

export async function fetchAlphaSymbolSearch(
  keywords: string,
): Promise<AlphaSymbolMatch[]> {
  if (!env.alphaApiKey || !keywords) return [];

  const url = buildUrl({
    function: "SYMBOL_SEARCH",
    keywords,
    apikey: env.alphaApiKey,
  });

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("AlphaVantage symbol search error");
  }

  const data = (await res.json()) as Record<string, unknown>;
  const clean = handleError(data);
  const matches = clean["bestMatches"] as Array<Record<string, string>> | undefined;
  if (!matches) return [];

  return matches.map((item) => ({
    symbol: item["1. symbol"] ?? "",
    name: item["2. name"] ?? "",
    type: item["3. type"] ?? "",
    region: item["4. region"] ?? "",
    currency: item["8. currency"] ?? "",
  }));
}

export async function fetchAlphaDaily(symbol: string): Promise<Record<string, AlphaTimeseries>> {
  if (!env.alphaApiKey) return {};
  const url = buildUrl({
    function: "TIME_SERIES_DAILY",
    symbol,
    outputsize: "compact",
    apikey: env.alphaApiKey,
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error("AlphaVantage daily error");
  const data = (await res.json()) as Record<string, unknown>;
  const clean = handleError(data);
  const payload = clean["Time Series (Daily)"] as AlphaResponse<Record<string, string>>;
  const result: Record<string, AlphaTimeseries> = {};
  if (!payload) return result;
  Object.entries(payload).forEach(([date, values]) => {
    result[date] = {
      open: Number(values["1. open"]),
      high: Number(values["2. high"]),
      low: Number(values["3. low"]),
      close: Number(values["4. close"]),
      volume: Number(values["5. volume"]),
    };
  });
  return result;
}
