import { strings } from "@/data/strings.ko";

export type CurrencyCode = "KRW" | "USD";
export type SignDisplay = "auto" | "always" | "never";

interface NumberFormatOptions {
  locale?: string;
  minDecimals?: number;
  maxDecimals?: number;
  trimTrailingZeros?: boolean;
}

export interface CurrencyFormatOptions {
  showSign?: boolean;
  signDisplay?: SignDisplay;
  decimals?: number;
  trimTrailingZeros?: boolean;
  locale?: string;
  showSecondary?: boolean;
  secondaryCurrency?: CurrencyCode;
  exchangeRate?: number;
  secondaryDecimals?: number;
  secondaryLocale?: string;
  secondaryApproxSymbol?: string;
}

export interface PercentFormatOptions {
  showSign?: boolean;
  signDisplay?: SignDisplay;
  decimals?: number;
  trimTrailingZeros?: boolean;
  locale?: string;
}

export interface RelativeTimeOptions {
  includeDate?: boolean;
  dateFormat?: "full" | "short";
  separator?: string;
}

const getDecimalSeparator = (locale: string) =>
  (1.1).toLocaleString(locale).substring(1, 2);

const trimTrailingZerosString = (value: string, locale: string) => {
  const separator = getDecimalSeparator(locale);
  if (!value.includes(separator)) return value;
  const regex = new RegExp(`\\${separator}0+$`);
  const trimmed = value.replace(regex, "");
  return trimmed.endsWith(separator) ? trimmed.slice(0, -1) : trimmed;
};

const formatNumberValue = (value: number, options: NumberFormatOptions) => {
  const locale = options.locale ?? "ko-KR";
  const minDecimals = options.minDecimals ?? 0;
  const maxDecimals = options.maxDecimals ?? minDecimals;
  let formatted = value.toLocaleString(locale, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });

  if (options.trimTrailingZeros) {
    formatted = trimTrailingZerosString(formatted, locale);
  }

  return formatted;
};

const resolveSign = (amount: number, showSign: boolean, signDisplay: SignDisplay) => {
  const isNegative = amount < 0;
  if (signDisplay === "never") return "";
  if (signDisplay === "always") return isNegative ? "-" : "+";
  if (isNegative) return "-";
  return showSign ? "+" : "";
};

// Financial formatting utilities following the spec

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "KRW",
  showSignOrOptions: boolean | CurrencyFormatOptions = false,
): string {
  const options =
    typeof showSignOrOptions === "boolean" ? { showSign: showSignOrOptions } : showSignOrOptions;
  const {
    showSign = false,
    signDisplay = "auto",
    decimals,
    trimTrailingZeros = false,
    locale,
    showSecondary = false,
    secondaryCurrency,
    exchangeRate,
    secondaryDecimals,
    secondaryLocale,
    secondaryApproxSymbol = "≒",
  } = options || {};

  const primaryLocale = locale ?? (currency === "USD" ? "en-US" : "ko-KR");
  const primaryDecimals = decimals ?? (currency === "USD" ? 2 : 0);
  const symbol = currency === "KRW" ? strings.currency.krwSymbol : strings.currency.usdSymbol;
  const sign = resolveSign(amount, showSign, signDisplay);
  const absAmount = Math.abs(amount);
  const primaryValue = formatNumberValue(absAmount, {
    locale: primaryLocale,
    minDecimals: primaryDecimals,
    maxDecimals: primaryDecimals,
    trimTrailingZeros,
  });
  const primaryText = `${sign}${symbol} ${primaryValue}`;

  if (!showSecondary || exchangeRate === undefined) {
    return primaryText;
  }

  // exchangeRate is secondary per primary (e.g. KRW -> USD rate)
  const secondaryCode = secondaryCurrency ?? (currency === "KRW" ? "USD" : "KRW");
  const secondarySymbol =
    secondaryCode === "KRW" ? strings.currency.krwSymbol : strings.currency.usdSymbol;
  const secondaryValue = absAmount * exchangeRate;
  const secondaryText = formatNumberValue(secondaryValue, {
    locale: secondaryLocale ?? (secondaryCode === "USD" ? "en-US" : "ko-KR"),
    minDecimals: secondaryDecimals ?? (secondaryCode === "USD" ? 2 : 0),
    maxDecimals: secondaryDecimals ?? (secondaryCode === "USD" ? 2 : 0),
    trimTrailingZeros,
  });
  const approxPrefix = secondaryApproxSymbol ? `${secondaryApproxSymbol} ` : "";

  return `${primaryText} (${approxPrefix}${secondarySymbol} ${secondaryText})`;
}

export function formatPercent(
  value: number,
  showSignOrOptions: boolean | PercentFormatOptions = true,
): string {
  const options =
    typeof showSignOrOptions === "boolean" ? { showSign: showSignOrOptions } : showSignOrOptions;
  const {
    showSign = true,
    signDisplay = "auto",
    decimals = 1,
    trimTrailingZeros = false,
    locale,
  } = options || {};

  const sign = resolveSign(value, showSign, signDisplay);
  const absValue = Math.abs(value);
  const formatted = formatNumberValue(absValue, {
    locale: locale ?? "ko-KR",
    minDecimals: decimals,
    maxDecimals: decimals,
    trimTrailingZeros,
  });

  return `${sign}${formatted}${strings.format.percentSuffix}`;
}

export function formatNumber(value: number, decimalsOrOptions: number | NumberFormatOptions = 0): string {
  const options =
    typeof decimalsOrOptions === "number"
      ? { minDecimals: decimalsOrOptions, maxDecimals: decimalsOrOptions }
      : decimalsOrOptions;

  return formatNumberValue(value, {
    locale: options.locale ?? "ko-KR",
    minDecimals: options.minDecimals ?? 0,
    maxDecimals: options.maxDecimals ?? options.minDecimals ?? 0,
    trimTrailingZeros: options.trimTrailingZeros,
  });
}

export function formatExchangeRate(rate: number, decimals = 2): string {
  return formatCurrency(rate, "KRW", {
    showSign: false,
    decimals,
    trimTrailingZeros: true,
  });
}

export function formatDate(date: Date, format: "full" | "short" | "time" = "full"): string {
  if (format === "time") {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (format === "short") {
    return date.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatRelativeTime(date: Date, options: RelativeTimeOptions = {}): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relative = "";
  if (diffMins < 1) relative = strings.format.relativeTime.justNow;
  else if (diffMins < 60) relative = strings.format.relativeTime.minutes(diffMins);
  else if (diffHours < 24) relative = strings.format.relativeTime.hours(diffHours);
  else if (diffDays === 1) relative = strings.format.relativeTime.yesterday;
  else if (diffDays < 7) relative = strings.format.relativeTime.days(diffDays);
  else relative = formatDate(date, "short");

  if (!options.includeDate) {
    return relative;
  }

  const absolute = formatDate(date, options.dateFormat ?? "full");
  const separator = options.separator ?? " ";
  return `${relative}${separator}(${absolute})`;
}

export function getCMILevel(value: number): "low" | "medium" | "high" {
  if (value < 33) return "low";
  if (value < 66) return "medium";
  return "high";
}

export function getCMIColor(value: number): string {
  if (value < 25) return "cmi-0";
  if (value < 50) return "cmi-25";
  if (value < 75) return "cmi-50";
  if (value < 90) return "cmi-75";
  return "cmi-100";
}
