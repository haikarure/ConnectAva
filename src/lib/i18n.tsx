import React, { createContext, useContext, useState, useCallback } from "react";

export type Lang = "id" | "en" | "ru" | "ko";
export type Currency = "IDR" | "USD" | "AUD" | "RUB" | "KRW";

type TString = { id: string; en: string; ru?: string; ko?: string };

type LangContextValue = {
  lang: Lang;
  currency: Currency;
  setLang: (l: Lang) => void;
  setCurrency: (c: Currency) => void;
  /** Pick localized text from a {id, en, ru, ko} object (falls back to en) */
  tf: (s: TString) => string;
  /** Format an IDR base amount into the active currency */
  formatPrice: (idr: number) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

// Default currency that follows the chosen language
const DEFAULT_CURRENCY: Record<Lang, Currency> = {
  id: "IDR",
  en: "USD",
  ru: "RUB",
  ko: "KRW",
};

// Conversion rates expressed as "1 unit of currency = N IDR"
const RATES: Record<Currency, number> = {
  IDR: 1,
  USD: 15800,
  AUD: 10200,
  RUB: 165,
  KRW: 12,
};

const SYMBOL: Record<Currency, string> = {
  IDR: "IDR ",
  USD: "$",
  AUD: "A$",
  RUB: "₽",
  KRW: "₩",
};

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>("en");
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY.en);

  // Picking a language also switches the currency to that locale's default
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setCurrency(DEFAULT_CURRENCY[l]);
  }, []);

  const tf = useCallback(
    (s: TString) => {
      if (lang === "id" && s.id) return s.id;
      if (lang === "ru") return s.ru ?? s.en;
      if (lang === "ko") return s.ko ?? s.en;
      return s.en;
    },
    [lang]
  );

  const formatPrice = useCallback(
    (idr: number) => {
      if (currency === "IDR") return `IDR ${(idr / 1_000_000).toFixed(1)}M`;
      const converted = Math.round(idr / RATES[currency]);
      return `${SYMBOL[currency]}${converted.toLocaleString("en-US")}`;
    },
    [currency]
  );

  return (
    <LangContext.Provider value={{ lang, currency, setLang, setCurrency, tf, formatPrice }}>
      {children}
    </LangContext.Provider>
  );
};

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
