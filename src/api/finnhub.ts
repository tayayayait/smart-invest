import { env } from "@/lib/env";

const REST_BASE = "https://finnhub.io/api/v1";

type QuoteResponse = {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
  t: number; // timestamp (unix)
};

type CandleResponse = {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  v: number[];
  t: number[];
  s: "ok" | "no_data";
};

export async function fetchQuote(symbol: string) {
  if (!env.finnhubApiKey) {
    throw new Error("Finnhub API key is missing. Set VITE_FINNHUB_API_KEY.");
  }
  const url = `${REST_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${env.finnhubApiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub quote error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as QuoteResponse;
  return data;
}

export async function fetchCandles(params: {
  symbol: string;
  resolution: string;
  from: number;
  to: number;
}) {
  if (!env.finnhubApiKey) {
    throw new Error("Finnhub API key is missing. Set VITE_FINNHUB_API_KEY.");
  }
  const { symbol, resolution, from, to } = params;
  const url =
    `${REST_BASE}/stock/candle?symbol=${encodeURIComponent(symbol)}` +
    `&resolution=${encodeURIComponent(resolution)}&from=${from}&to=${to}` +
    `&token=${env.finnhubApiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub candles error: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as CandleResponse;
  return data;
}

export type SymbolSearchItem = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};

type SymbolSearchResponse = {
  count: number;
  result: SymbolSearchItem[];
};

export async function searchSymbols(query: string) {
  if (!env.finnhubApiKey) {
    throw new Error("Finnhub API key is missing. Set VITE_FINNHUB_API_KEY.");
  }
  const url = `${REST_BASE}/search?q=${encodeURIComponent(query)}&token=${env.finnhubApiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub search error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as SymbolSearchResponse;
}

// ---- WebSocket (trade/price updates) ----

export type TradeMessage = {
  type: string;
  data?: {
    s: string; // symbol
    p: number; // price
    t: number; // timestamp ms
    v?: number; // volume
  }[];
};

export function openTradeSocket(
  symbols: string[],
  handlers: {
    onMessage?: (msg: TradeMessage) => void;
    onError?: (ev: Event) => void;
    onClose?: (ev: CloseEvent) => void;
  } = {}
) {
  if (!env.finnhubApiKey) {
    throw new Error("Finnhub API key is missing. Set VITE_FINNHUB_API_KEY.");
  }

  const ws = new WebSocket(`${env.finnhubWsUrl}?token=${env.finnhubApiKey}`);

  ws.addEventListener("open", () => {
    symbols.forEach((s) => {
      ws.send(JSON.stringify({ type: "subscribe", symbol: s }));
    });
  });

  if (handlers.onMessage) {
    ws.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data) as TradeMessage;
        handlers.onMessage?.(parsed);
      } catch (e) {
        console.error("Finnhub WS parse error", e);
      }
    });
  }

  if (handlers.onError) {
    ws.addEventListener("error", handlers.onError);
  }
  if (handlers.onClose) {
    ws.addEventListener("close", handlers.onClose);
  }

  const unsubscribe = () => {
    symbols.forEach((s) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol: s }));
      }
    });
    ws.close();
  };

  return { ws, unsubscribe };
}
