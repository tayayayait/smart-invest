import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates, EximExchangeItem } from "@/api/exchange";
import { env } from "@/lib/env";

const parseRate = (value: string | undefined) => {
  if (!value) return null;
  const numeric = Number(value.replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const extractUsdRate = (items?: EximExchangeItem[]) => {
  const usd = items?.find((item) => item.cur_unit === "USD");
  return {
    usd,
    rate: usd ? parseRate(usd.deal_bas_r) : null,
  };
};

export function useExchangeRates(searchDate?: string) {
  const enabled = Boolean(env.eximApiKey);

  const query = useQuery({
    queryKey: ["exchangeRates", searchDate],
    queryFn: () => fetchExchangeRates({ searchDate }),
    enabled,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const { usd, rate } = extractUsdRate(query.data);

  return {
    rate,
    usd,
    isLoading: query.isLoading,
    isError: query.isError || (!enabled && !query.isLoading),
    error: query.error,
    updatedAt: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    isEnabled: enabled,
  };
}
