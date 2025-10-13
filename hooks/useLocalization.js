import * as Localization from 'expo-localization';
import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import i18n, { changeLanguage, isRTL } from '../utils/i18n';

export const useLocalization = () => {
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);
  const [rtl, setRTL] = useState(isRTL());

  useEffect(() => {
    // Initialize with system language
    const systemLocale = Localization.getLocales()[0]?.languageCode || 'en';
    if (systemLocale !== currentLocale) {
      handleLanguageChange(systemLocale);
    }
  }, []);

  useEffect(() => {
    // Apply RTL settings
    if (I18nManager.isRTL !== rtl) {
      I18nManager.forceRTL(rtl);
      // In production, you might need to restart the app
    }
  }, [rtl]);

  const handleLanguageChange = (locale) => {
    const newRTL = changeLanguage(locale);
    setCurrentLocale(locale);
    setRTL(newRTL);
  };

  return {
    currentLocale,
    isRTL: rtl,
    changeLanguage: handleLanguageChange,
    t: (key) => i18n.t(key),
  };
};