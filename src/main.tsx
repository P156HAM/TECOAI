import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import global_en from "@/i18n/locales/en/global.json";
import global_sv from "@/i18n/locales/sv/global.json";
import LanguageDetector from "i18next-browser-languagedetector";
import "./index.css";
import App from "./App.tsx";

i18next.use(LanguageDetector).init({
  interpolation: { escapeValue: false },
  fallbackLng: "sv",
  resources: {
    en: { global: global_en },
    sv: { global: global_sv },
  },
  detection: {
    order: ["querystring", "cookie"],
    caches: ["cookie"],
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </StrictMode>
);
