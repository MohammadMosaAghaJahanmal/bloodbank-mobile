// utils/i18n.js
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { I18nManager, Platform } from 'react-native';

// Initialize i18n
const i18n = new I18n();

const STORAGE_KEY = 'app_language';

// Your translations object remains the same...
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
    LOGOUT_CONFIRMATION_TITLE: 'Logout',
    LOGOUT_CONFIRMATION_MESSAGE: 'Are you sure you want to logout?',
    CANCEL: 'Cancel',
    USER: 'User',
    APP_VERSION: 'App Version',
    TERMS_OF_SERVICE: 'Terms of Service',
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
    LOGOUT_CONFIRMATION_TITLE: 'تسجيل الخروج',
    LOGOUT_CONFIRMATION_MESSAGE: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    CANCEL: 'إلغاء',
    USER: 'مستخدم',
    APP_VERSION: 'إصدار التطبيق',
    TERMS_OF_SERVICE: 'شروط الخدمة',
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
    LOGOUT_CONFIRMATION_TITLE: 'وتل',
    LOGOUT_CONFIRMATION_MESSAGE: 'آیا تاسې ډاډه یاست چې وتل غواړئ؟',
    CANCEL: 'لغوه کول',
    USER: 'کارن',
    APP_VERSION: 'د اپ نسخه',
    TERMS_OF_SERVICE: 'د خدمت شرطونه',
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
    LOGOUT_CONFIRMATION_TITLE: 'خروج',
    LOGOUT_CONFIRMATION_MESSAGE: 'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
    CANCEL: 'لغو',
    USER: 'کاربر',
    APP_VERSION: 'نسخه برنامه',
    TERMS_OF_SERVICE: 'شرایط خدمات',
  },
};

i18n.translations = translations;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.missingTranslation = (scope, options) => {
  return scope;
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

    console.log('App initialized with forced EN language and LTR layout');
    return 'en';
  } catch (error) {
    console.log('Error initializing i18n:', error);
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