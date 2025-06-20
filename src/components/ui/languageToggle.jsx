// src/components/ui/languageToggle.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "he" ? "rtl" : "ltr";
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-pink-200 px-4 py-2 rounded shadow hover:bg-pink-300 transition"
    >
      {i18n.language === "he" ? "English" : "עברית"}
    </button>
  );
};

export default LanguageToggle;