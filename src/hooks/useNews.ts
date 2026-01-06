import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/api/naverNews";

export function useNews(query?: string, limit = 3) {
  const enabled = Boolean(query && query.trim().length > 0);

  const queryResult = useQuery({
    queryKey: ["naverNews", query],
    queryFn: () =>
      fetchNews({
        query: query ?? "",
        display: limit,
        sort: "date",
      }),
    enabled,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return {
    items: queryResult.data?.items ?? [],
    total: queryResult.data?.total ?? 0,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    isEnabled: enabled,
  };
}
