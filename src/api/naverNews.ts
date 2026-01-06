import { env } from "@/lib/env";

const stripTags = (text: string) => text.replace(/<[^>]+>/g, "");

const joinUrl = (base: string, path: string) => {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  if (!trimmedBase) return `/${trimmedPath}`;
  return `${trimmedBase}/${trimmedPath}`;
};

export type NaverNewsItem = {
  title: string;
  description: string;
  link: string;
  originallink?: string;
  pubDate?: string;
};

export type NewsItem = {
  title: string;
  summary: string;
  url: string;
  publishedAt?: string;
};

export type FetchNewsParams = {
  query: string;
  display?: number;
  start?: number;
  sort?: "sim" | "date";
};

export type FetchNewsResponse = {
  total?: number;
  items: NewsItem[];
};

const normalize = (item: NaverNewsItem): NewsItem => ({
  title: stripTags(item.title ?? ""),
  summary: stripTags(item.description ?? ""),
  url: item.originallink || item.link || "",
  publishedAt: item.pubDate,
});

// Frontend only calls the backend proxy (`/api/naver-news`) to avoid exposing Naver keys.
// The backend must append `X-Naver-Client-Id` and `X-Naver-Client-Secret` headers.
export async function fetchNews({
  query,
  display = 20,
  start = 1,
  sort = "date",
}: FetchNewsParams): Promise<FetchNewsResponse> {
  if (!query) {
    return { items: [] };
  }

  const base = joinUrl(env.apiBaseUrl ?? "", env.newsProxyPath);
  const params = new URLSearchParams({
    query,
    display: String(Math.min(Math.max(display, 1), 100)),
    start: String(Math.min(Math.max(start, 1), 1000)),
    sort,
  });
  const url = base.startsWith("http") ? new URL(`${base}?${params}`).toString() : `${base}?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Naver news fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { items?: NaverNewsItem[]; total?: number };
  return {
    total: data.total,
    items: (data.items ?? []).map(normalize),
  };
}
