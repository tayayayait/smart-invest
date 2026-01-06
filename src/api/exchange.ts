import { env } from "@/lib/env";

export type EximExchangeItem = {
  result?: number;
  cur_unit: string;
  cur_nm: string;
  ttb: string; // 전신환(송금) 받으실 때
  tts: string; // 전신환(송금) 보내실 때
  deal_bas_r: string; // 매매기준율
  bkpr: string; // 장부가
  kftc_deal_bas_r?: string; // 서울외국환중개 매매기준율
  kftc_bkpr?: string; // 서울외국환중개 장부가
  yy_efee_r?: string;
  ten_dd_efee_r?: string;
};

export type FetchExchangeParams = {
  /**
   * 검색 날짜. 미지정 시 API 기본(당일) 사용.
   * 형식: YYYYMMDD 또는 YYYY-MM-DD.
   */
  searchDate?: string;
  /** AP01: 환율, AP02: 대출금리, AP03: 국제금리 */
  dataCode?: "AP01" | "AP02" | "AP03";
};

const DEFAULT_DATA_CODE: Exclude<FetchExchangeParams["dataCode"], undefined> = "AP01";

/**
 * 한국수출입은행 환율 API 래퍼.
 * 참고: 일 1,000회 제한, 2025-06-25 이후 도메인 oapi.koreaexim.go.kr 사용.
 */
const joinUrl = (base: string, path: string) => {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  if (!trimmedBase) return `/${trimmedPath}`;
  return `${trimmedBase}/${trimmedPath}`;
};

export async function fetchExchangeRates(params: FetchExchangeParams = {}): Promise<EximExchangeItem[]> {
  if (!env.eximApiKey) {
    throw new Error("Exim API key is missing. Set VITE_EXIM_API_KEY in .env.local.");
  }

  const { searchDate, dataCode = DEFAULT_DATA_CODE } = params;
  const isBrowser = typeof window !== "undefined";
  const base = isBrowser
    ? joinUrl(env.apiBaseUrl ?? "", env.eximProxyPath)
    : env.eximApiBaseUrl;

  const query = new URLSearchParams({
    authkey: env.eximApiKey,
    data: dataCode,
  });
  if (searchDate) {
    query.set("searchdate", searchDate.replace(/-/g, ""));
  }

  const url = base.startsWith("http")
    ? new URL(`${base}?${query.toString()}`).toString()
    : `${base}?${query.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Exim API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as EximExchangeItem[];

  // API가 실패 시 result=2/3/4 같은 값으로만 구성될 수 있음.
  if (Array.isArray(data) && data.length > 0 && data[0].result && data[0].result !== 1) {
    const code = data[0].result;
    throw new Error(`Exim API returned failure code: ${code}`);
  }

  return data;
}
