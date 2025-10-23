// utils/i18n.js
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Initialize i18n
const i18n = new I18n();

// Enhanced translations with all UI texts
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
    BLOOD_BANK: "Blood Bank",
    JOIN_BLOOD_DONORS: "Join Blood Donors",
    STEP: "Step",
    CONTINUE_TO_BLOOD_DETAILS: "Continue to Blood Details",
    UPDATE_PROFILE: "Update Profile",
    // Add all other texts from your app here
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
    REGISTER: 'تسجيل',
    LOGIN: 'تسجيل الدخول',
    MY_PROFILE: 'ملفي الشخصي',
    PRIVACY_POLICY: 'سياسة الخصوصية',
    CONTACT_US: 'اتصل بنا',
    LOGOUT: 'تسجيل الخروج',
    NEWS_FEED: 'الأخبار',
    BLOOD_BANK: "بنك الدم",
    JOIN_BLOOD_DONORS: "انضم إلى متبرعي الدم",
    STEP: "خطوة",
    CONTINUE_TO_BLOOD_DETAILS: "المتابعة إلى تفاصيل الدم",
    UPDATE_PROFILE: "تحديث الملف",
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
    BLOOD_BANK: "د وينې بانک",
    JOIN_BLOOD_DONORS: "د وينې ورکوونکو سره یوځای شئ",
    STEP: "ګام",
    CONTINUE_TO_BLOOD_DETAILS: "د وينې توضیحاتو ته لاړشئ",
    UPDATE_PROFILE: "پروفایل تازه کړئ",
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
    BLOOD_BANK: "بانک خون",
    JOIN_BLOOD_DONORS: "به اهداکنندگان خون بپیوندید",
    STEP: "مرحله",
    CONTINUE_TO_BLOOD_DETAILS: "ادامه به جزئیات خون",
    UPDATE_PROFILE: "بروزرسانی پروفایل",
  },
};

i18n.translations = translations;
i18n.locale = Localization.getLocales()[0]?.languageCode || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.missingTranslation = (scope, options) => {
  console.warn(`Missing translation for: ${scope} in locale: ${i18n.locale}`);
  return scope; // Return the key instead of throwing error
};

export const getCurrentLocale = () => i18n.locale;

export const isRTL = (locale = i18n.locale) => {
  const rtlLanguages = ['ar', 'ps', 'pa', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(locale.split('-')[0]); // Handle locale variants like en-US
};

export const changeLanguage = (locale) => {
  const newLocale = locale || 'en';
  i18n.locale = newLocale;
  return isRTL(newLocale);
};

export const getSystemLocales = () => Localization.getLocales();

export const getSystemLanguage = () => {
  const locales = Localization.getLocales();
  return locales[0]?.languageCode || 'en';
};

export const t = (key, options = {}) => {
  return i18n.t(key, options);
};

export default i18n;