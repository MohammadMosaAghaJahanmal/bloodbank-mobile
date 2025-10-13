import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Initialize i18n
const i18n = new I18n();

// Translations
const translations = {
  en: {
    HOME: 'Home',
    SETTINGS: 'Settings',
    PROFILE: 'Profile',
    ABOUT: 'About',
    DETAILS: 'Details',
    LANGUAGE: 'Language',
    DIRECTION: 'Layout Direction',
    WELCOME: 'Welcome to the app',
  },
  ar: {
    HOME: 'الرئيسية',
    SETTINGS: 'الإعدادات',
    PROFILE: 'الملف الشخصي',
    ABOUT: 'حول',
    DETAILS: 'التفاصيل',
    LANGUAGE: 'اللغة',
    DIRECTION: 'اتجاه التخطيط',
    WELCOME: 'مرحباً بك في التطبيق',
  },
  he: {
    HOME: 'בית',
    SETTINGS: 'הגדרות',
    PROFILE: 'פרופיל',
    ABOUT: 'אודות',
    DETAILS: 'פרטים',
    LANGUAGE: 'שפה',
    DIRECTION: 'כיוון פריסה',
    WELCOME: 'ברוך הבא לאפליקציה',
  }
};

i18n.translations = translations;
i18n.locale = Localization.getLocales()[0]?.languageCode || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const getCurrentLocale = () => {
  return i18n.locale;
};

export const isRTL = (locale = i18n.locale) => {
  return locale.startsWith('ar') || locale.startsWith('he');
};

export const changeLanguage = (locale) => {
  i18n.locale = locale;
  return isRTL(locale);
};

export const getSystemLocales = () => {
  return Localization.getLocales();
};

export const getSystemLanguage = () => {
  const locales = Localization.getLocales();
  return locales[0]?.languageCode || 'en';
};

export default i18n;