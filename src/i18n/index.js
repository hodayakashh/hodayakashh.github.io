import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import he from "./he.json";
import homeEn from "./home_en.json";
import homeHe from "./home_he.json";
import studiesEn from "./studies_en.json";
import studiesHe from "./studies_he.json";
import yearEn from "./year_en.json";
import yearHe from "./year_he.json";
import Studies from "@/pages/Studies";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: en, 
        home: homeEn,
        studies:studiesEn,
        year: yearEn
      },
      he: { 
        translation: he,
        home: homeHe,
        studies: studiesHe,
        year: yearHe
      }
    },
    fallbackLng: "en",
    defaultNS: "translation", 
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;