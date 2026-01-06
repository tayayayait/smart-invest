import { useEffect, useMemo, useState } from "react";
import { openTradeSocket } from "@/api/finnhub";
import { env } from "@/lib/env";

type TradePrice = {
  price: number;
  time: number;
  volume?: number;
};

type TradeMap = Record<string, TradePrice>;

export function useTradeSocket(symbols: string[]) {
  const [prices, setPrices] = useState<TradeMap>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uniqueSymbols = useMemo(
    () => Array.from(new Set(symbols.filter(Boolean))),
    [symbols],
  );
  const key = useMemo(() => uniqueSymbols.sort().join(","), [uniqueSymbols]);
  const enabled = Boolean(env.finnhubApiKey && uniqueSymbols.length > 0);

  useEffect(() => {
    if (!enabled) {
      setIsConnected(false);
      return;
    }

    try {
      const { ws, unsubscribe } = openTradeSocket(uniqueSymbols, {
        onMessage: (msg) => {
          if (msg.type !== "trade" || !msg.data) return;
          setPrices((prev) => {
            const next = { ...prev };
            msg.data?.forEach((trade) => {
              next[trade.s] = {
                price: trade.p,
                time: trade.t,
                volume: trade.v,
              };
            });
            return next;
          });
        },
        onError: () => setError(new Error("Finnhub websocket error")),
        onClose: () => setIsConnected(false),
      });

      const handleOpen = () => setIsConnected(true);
      ws.addEventListener("open", handleOpen);

      return () => {
        ws.removeEventListener("open", handleOpen);
        unsubscribe();
      };
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    }
  }, [enabled, key]);

  return {
    prices,
    isConnected,
    error,
    isEnabled: enabled,
  };
}
