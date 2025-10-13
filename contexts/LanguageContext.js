import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { changeLanguage, getSystemLanguage, isRTL } from '../utils/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState(getSystemLanguage());
  const [rtl, setRTL] = useState(isRTL());

  useEffect(() => {
    // Force RTL if needed
    if (I18nManager.isRTL !== rtl) {
      I18nManager.forceRTL(rtl);
      // Note: I18nManager.forceRTL might require app restart in some cases
    }
  }, [rtl]);

  const toggleLanguage = (locale) => {
    const newRTL = changeLanguage(locale);
    setCurrentLocale(locale);
    setRTL(newRTL);
  };

  return (
    <LanguageContext.Provider value={{ 
      isRTL: rtl, 
      currentLocale,
      toggleLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};