import React, { createContext, useContext, useState, useEffect } from 'react';
import { DICTIONARY } from '../lib/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('eduquest_lang');
      if (saved === 'en' || saved === 'id') return saved;
    } catch (e) {}
    return 'id';
  });

  const setLanguage = (lang) => {
    if (lang === 'id' || lang === 'en') {
      setLanguageState(lang);
      try {
        localStorage.setItem('eduquest_lang', lang);
      } catch (e) {}
    }
  };

  const toggleLanguage = () => {
    const next = language === 'id' ? 'en' : 'id';
    setLanguage(next);
    return next;
  };

  const t = (key, fallback = '') => {
    const currentDict = DICTIONARY[language] || DICTIONARY.id;
    return currentDict[key] ?? fallback ?? key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    langName: DICTIONARY[language]?.langName || 'Indonesia',
    langFlag: DICTIONARY[language]?.langFlag || '🇮🇩'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback safe object if outside provider
    return {
      language: 'id',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key, fallback = '') => DICTIONARY.id[key] ?? fallback ?? key,
      langName: 'Indonesia',
      langFlag: '🇮🇩'
    };
  }
  return context;
}
