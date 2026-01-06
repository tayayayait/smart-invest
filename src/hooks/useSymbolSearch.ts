import { useQuery } from "@tanstack/react-query";
import { searchSymbols, type SymbolSearchItem } from "@/api/finnhub";
import { fetchAlphaSymbolSearch } from "@/api/alphaVantage";
import { env } from "@/lib/env";

export function useSymbolSearch(query: string, limit = 8) {
  const trimmed = query.trim();
  const enabled = Boolean(trimmed.length >= 2 && (env.finnhubApiKey || env.alphaApiKey));

  const queryResult = useQuery({
    queryKey: ["finnhubSearch", query],
    queryFn: async () => {
      const finnhubResults = env.finnhubApiKey
        ? (await searchSymbols(query)).result ?? []
        : [];
      const alphaResults = env.alphaApiKey
        ? await fetchAlphaSymbolSearch(trimmed)
        : [];

      const mappedAlpha: SymbolSearchItem[] = alphaResults.map((item) => ({
        symbol: item.symbol,
        displaySymbol: item.symbol,
        description: item.name,
        type: item.type,
      }));

      return {
        result: [...finnhubResults, ...mappedAlpha],
        count: finnhubResults.length + mappedAlpha.length,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const items = queryResult.data?.result ?? [];

  return {
    items: items.slice(0, limit),
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    isEnabled: enabled,
  };
}
