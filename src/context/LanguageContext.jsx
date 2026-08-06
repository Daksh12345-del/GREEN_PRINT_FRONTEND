import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations.js";

const LanguageContext = createContext(null);
const STORAGE_KEY = "greenprint_language";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || "en");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((l) => (l === "en" ? "hi" : "en"));
  }

  // t("key") looks up the current language's string; falls back to the
  // English string, then to the key itself, so a missing translation
  // never breaks the page — it just shows English instead.
  function t(key) {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
