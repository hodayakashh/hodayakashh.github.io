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
      en: { 
        translation: en, // הוספנו את קובץ התרגום הכללי
        home: homeEn 
      },
      he: { 
        translation: he, // הוספנו את קובץ התרגום הכללי
        home: homeHe 
      }
    },
    fallbackLng: "en",
    defaultNS: "translation", // שינינו ל-translation כברירת מחדל
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;