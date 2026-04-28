"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import fr, { Translations } from "./fr";
import en from "./en";

type Lang = "fr" | "en";

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "fr",
  t: fr,
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const t = lang === "fr" ? fr : en;
  const toggle = () => setLang((l) => (l === "fr" ? "en" : "fr"));

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
