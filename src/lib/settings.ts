export type AppSettings = {
  currencyCode: string; // e.g., "USD", "INR", "EUR"
  locale: string; // e.g., "en-US", "en-IN"
};

const STORAGE_KEY = "app:settings";

const DEFAULT_SETTINGS: AppSettings = {
  currencyCode: "USD",
  locale: "en-US",
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...(typeof parsed === "object" && parsed ? parsed : {}),
    } as AppSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(patch: Partial<AppSettings>) {
  const next = { ...getSettings(), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function formatCurrency(amount: number): string {
  const { currencyCode, locale } = getSettings();
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode, maximumFractionDigits: 2 }).format(
      amount || 0,
    );
  } catch {
    // Fallback
    return `${currencySymbolFallback(currencyCode)}${(amount || 0).toLocaleString()}`;
  }
}

function currencySymbolFallback(code: string): string {
  switch (code) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "INR":
      return "₹";
    case "JPY":
      return "¥";
    default:
      return "";
  }
}

