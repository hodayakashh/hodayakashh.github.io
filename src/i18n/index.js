import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import he from "./he.json";
import homeEn from "./home_en.json";
import homeHe from "./home_he.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { home: homeEn },
      he: { home: homeHe }
    },
    fallbackLng: "en",
    defaultNS: "home",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;