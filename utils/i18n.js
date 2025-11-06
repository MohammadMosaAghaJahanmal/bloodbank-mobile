
// utils/i18n.js
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { I18nManager, Platform } from 'react-native';
import { translations } from './dictionary';
// Initialize i18n
const i18n = new I18n();


i18n.translations = translations;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Enhanced missing translation handler
i18n.missingTranslation = (scope, options) => {
  console.warn(`🌐 Missing translation for key: "${scope}" in locale: "${i18n.locale}"`);
  
  // Option 1: Return the key itself (cleaner)
  // return scope;
  
  // Option 2: Return "missing_key" prefix (more visible for debugging)
  return `missing_${scope}`;
  
  // Option 3: Try to return from default locale (English)
  // if (i18n.locale !== 'en' && translations.en && translations.en[scope]) {
  //   return translations.en[scope];
  // }
  // return scope;
};

// Enhanced translation function with fallback
export const t = (key, options = {}) => {
  if (!key || typeof key !== 'string') {
    console.warn('🌐 Invalid translation key:', key);
    return 'invalid_key';
  }
  
  try {
    const result = i18n.t(key, options);
    
    // Check if the result indicates a missing translation
    if (result === key || result.startsWith('missing_')) {
      // Try to get from default locale (English)
      if (i18n.locale !== 'en' && translations.en && translations.en[key]) {
        return translations.en[key];
      }
      
      // If still not found, return the key or missing indicator based on preference
      if (options.returnKeyOnMissing !== false) {
        return key; // Return the original key
      }
    }
    
    return result;
  } catch (err) {
    console.error('🌐 Translation error:', err, 'for key:', key);
    
    // Fallback strategies
    if (translations.en && translations.en[key]) {
      return translations.en[key]; // Fallback to English
    }
    
    return key; // Return the key as last resort
  }
};

// Safe translation function that never throws
export const safeT = (key, options = {}) => {
  try {
    return t(key, options);
  } catch (err) {
    console.error('🌐 Safe translation error:', err);
    return key || 'translation_error';
  }
};

// Check if a translation exists
export const hasTranslation = (key, locale = i18n.locale) => {
  try {
    const translation = translations[locale]?.[key];
    return translation && translation !== key && !translation.startsWith('missing_');
  } catch (err) {
    return false;
  }
};

// Get all missing translations for current locale
export const getMissingTranslations = (locale = i18n.locale) => {
  const missing = [];
  const allKeys = new Set();
  
  // Collect all unique keys from all languages
  Object.values(translations).forEach(lang => {
    Object.keys(lang).forEach(key => allKeys.add(key));
  });
  
  // Check which keys are missing in the target locale
  allKeys.forEach(key => {
    if (!hasTranslation(key, locale)) {
      missing.push(key);
    }
  });
  
  return missing;
};

// Always start with English
export const initializeI18n = async () => {
  try {
    // Force English on startup
    i18n.locale = 'en';
    
    // Force LTR layout
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    
    if (Platform.OS === 'android') {
      I18nManager.swapLeftAndRightInRTL(false);
    }

    console.log('🌐 App initialized with forced EN language and LTR layout');
    
    // Log missing translations for debugging
    const missing = getMissingTranslations('en');
    if (missing.length > 0) {
      console.log('🌐 Missing EN translations:', missing);
    }
    
    return 'en';
  } catch (err) {
    console.log('🌐 Error initializing i18n:', err);
    // Fallback to English
    i18n.locale = 'en';
    return 'en';
  }
};

export const getCurrentLocale = () => i18n.locale;

export const isRTL = (locale = i18n.locale) => {
  const rtlLanguages = ['ar', 'ps', 'pa', 'he', 'fa', 'ur'];
  const baseLocale = locale.split('-')[0];
  return rtlLanguages.includes(baseLocale);
};

export const changeLanguage = (locale) => {
  try {
    const newLocale = locale || 'en';
    i18n.locale = newLocale;
    
    // Log missing translations when changing language
    const missing = getMissingTranslations(newLocale);
    if (missing.length > 0) {
      console.log(`🌐 Missing ${newLocale} translations:`, missing);
    }
    
    return isRTL(newLocale);
  } catch (err) {
    console.error('🌐 Error changing language:', err);
    i18n.locale = 'en';
    return false;
  }
};

export const getSystemLocales = () => Localization.getLocales();

export const getSystemLanguage = () => {
  try {
    const locales = Localization.getLocales();
    return locales[0]?.languageCode || 'en';
  } catch (err) {
    return 'en';
  }
};

// Export the enhanced i18n instance
export default i18n;