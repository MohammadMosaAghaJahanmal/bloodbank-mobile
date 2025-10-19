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
    REGISTER: 'Register',
    LOGIN: 'Login',
    MY_PROFILE: 'My Profile',
    PRIVACY_POLICY: 'Privacy Policy',
    CONTACT_US: 'Contact Us',
    LOGOUT: 'Log Out',
    NEWS_FEED: 'News Feed',
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
    REGISTER: 'Register',
    LOGIN: 'Login',
    MY_PROFILE: 'My Profile',
    PRIVACY_POLICY: 'Privacy Policy',
    CONTACT_US: 'Contact Us',
    LOGOUT: 'Log Out',
    NEWS_FEED: 'News Feed',
  },
    ps: {
    HOME: 'کورپاڼه',
    SETTINGS: 'تنظیمات',
    PROFILE: 'پروفایل',
    ABOUT: 'په اړه',
    DETAILS: 'تفصیلات',
    LANGUAGE: 'ژبه',
    DIRECTION: 'د ترتیب لوری',
    WELCOME: 'اپ ته ښه راغلاست',
    REGISTER: 'راجستر',
    LOGIN: 'ننوتل',
    MY_PROFILE: 'زما پروفایل',
    PRIVACY_POLICY: 'د محرمیت تګلاره',
    CONTACT_US: 'اړیکه ونیسئ',
    LOGOUT: 'وتل',
    NEWS_FEED: 'خبرونه',
  },

  pa: {
    HOME: 'خانه',
    SETTINGS: 'تنظیمات',
    PROFILE: 'پروفایل',
    ABOUT: 'درباره ما',
    DETAILS: 'جزئیات',
    LANGUAGE: 'زبان',
    DIRECTION: 'جهت صفحه',
    WELCOME: 'به برنامه خوش آمدید',
    REGISTER: 'ثبت‌نام',
    LOGIN: 'ورود',
    MY_PROFILE: 'پروفایل من',
    PRIVACY_POLICY: 'سیاست محرمانگی',
    CONTACT_US: 'تماس با ما',
    LOGOUT: 'خروج',
    NEWS_FEED: 'اخبار',
  },
};

i18n.translations = translations;
i18n.locale = Localization.getLocales()[0]?.languageCode || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const getCurrentLocale = () => {
  return i18n.locale;
};

export const isRTL = (locale = i18n.locale) => {
  return locale.startsWith('ar') || locale.startsWith('ps') || locale.startsWith('pa');
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