// src/components/ui/languageToggle.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {i18n.language === "he" ? "EN" : "עב"}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          onChange={toggleLanguage}
          checked={i18n.language === "he"}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative transition-colors">
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
        </div>
      </label>
    </div>
  );
};

export default LanguageToggle;