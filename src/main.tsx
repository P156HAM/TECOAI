import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { store } from "@/store/store";
import global_en from "@/i18n/locales/en/global.json";
import global_sv from "@/i18n/locales/sv/global.json";
import App from "./App";
import "./index.css";

// Configure i18next
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

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </Provider>
  </StrictMode>
);
