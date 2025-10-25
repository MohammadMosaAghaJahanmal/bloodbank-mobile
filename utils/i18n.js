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
    // General
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

    // Contact Us Screen
    FULL_NAME: 'Full Name',
    EMAIL: 'Email',
    SUBJECT: 'Subject',
    MESSAGE: 'Message',
    ENTER_NAME: 'Enter your full name',
    ENTER_EMAIL: 'Enter your email',
    ENTER_SUBJECT: 'What is your message about?',
    ENTER_MESSAGE: 'Write your message',
    SEND: 'Send',
    SEND_MESSAGE: 'Send Message',
    THANK_YOU: 'Thank you!',
    CONTACT_SENT: 'Your message has been sent.',
    ERROR: 'Error',
    TRY_AGAIN: 'Please try again.',
    WE_REPLY_SOON: 'We will get back to you soon.',
    GET_IN_TOUCH: 'Get in touch with us',

    // Validation messages
    NAME_TOO_SHORT: 'Name is too short',
    NAME_TOO_LONG: 'Name is too long',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_TOO_LONG: 'Email is too long',
    EMAIL_INVALID: 'Invalid email address',
    SUBJECT_TOO_SHORT: 'Subject is too short',
    MESSAGE_TOO_SHORT: 'Message is too short',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again later.',
  },

  ps: {
    // عمومي
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
    BLOOD_BANK: "د وینې بانک",
    JOIN_BLOOD_DONORS: "د وینې ورکوونکو سره یوځای شئ",
    STEP: "ګام",
    CONTINUE_TO_BLOOD_DETAILS: "د وینې تفصیلاتو ته لاړ شئ",
    UPDATE_PROFILE: "پروفایل تازه کړئ",
    LOGOUT_CONFIRMATION_TITLE: 'وتل',
    LOGOUT_CONFIRMATION_MESSAGE: 'آیا ډاډه یاست چې وتل غواړئ؟',
    CANCEL: 'لغوه کول',
    USER: 'کارن',
    APP_VERSION: 'د اپ نسخه',
    TERMS_OF_SERVICE: 'د خدمت شرطونه',

    // د اړیکې فورم
    FULL_NAME: 'بشپړ نوم',
    EMAIL: 'برېښنالیک',
    SUBJECT: 'موضوع',
    MESSAGE: 'پیغام',
    ENTER_NAME: 'خپل بشپړ نوم ولیکئ',
    ENTER_EMAIL: 'خپل برېښنالیک ولیکئ',
    ENTER_SUBJECT: 'ستاسې د پیغام موضوع څه ده؟',
    ENTER_MESSAGE: 'خپل پیغام ولیکئ',
    SEND: 'ولیږئ',
    SEND_MESSAGE: 'پیغام ولیږئ',
    THANK_YOU: 'مننه!',
    CONTACT_SENT: 'ستاسې پیغام واستول شو.',
    ERROR: 'تېروتنه',
    TRY_AGAIN: 'بیا هڅه وکړئ.',
    WE_REPLY_SOON: 'موږ به ژر له تاسو سره اړیکه ونیسو.',
    GET_IN_TOUCH: 'له موږ سره اړیکه ونیسئ',

    // د اعتبار پیغامونه
    NAME_TOO_SHORT: 'نوم ډیر لنډ دی',
    NAME_TOO_LONG: 'نوم ډیر اوږد دی',
    EMAIL_REQUIRED: 'برېښنالیک اړین دی',
    EMAIL_TOO_LONG: 'برېښنالیک ډیر اوږد دی',
    EMAIL_INVALID: 'ناسم برېښنالیک',
    SUBJECT_TOO_SHORT: 'موضوع لنډه ده',
    MESSAGE_TOO_SHORT: 'پیغام لنډ دی',
    SOMETHING_WENT_WRONG: 'یوه تېروتنه وشوه، مهرباني وکړئ بیا هڅه وکړئ.',
  },

  pa: {
    // عمومی
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

    // فرم تماس
    FULL_NAME: 'نام کامل',
    EMAIL: 'ایمیل',
    SUBJECT: 'موضوع',
    MESSAGE: 'پیام',
    ENTER_NAME: 'نام کامل خود را وارد کنید',
    ENTER_EMAIL: 'ایمیل خود را وارد کنید',
    ENTER_SUBJECT: 'موضوع پیام شما چیست؟',
    ENTER_MESSAGE: 'پیام خود را بنویسید',
    SEND: 'ارسال',
    SEND_MESSAGE: 'ارسال پیام',
    THANK_YOU: 'متشکرم!',
    CONTACT_SENT: 'پیام شما با موفقیت ارسال شد.',
    ERROR: 'خطا',
    TRY_AGAIN: 'دوباره تلاش کنید.',
    WE_REPLY_SOON: 'به زودی با شما تماس خواهیم گرفت.',
    GET_IN_TOUCH: 'با ما در تماس باشید',

    // پیام‌های اعتبارسنجی
    NAME_TOO_SHORT: 'نام خیلی کوتاه است',
    NAME_TOO_LONG: 'نام خیلی طولانی است',
    EMAIL_REQUIRED: 'ایمیل الزامی است',
    EMAIL_TOO_LONG: 'ایمیل خیلی طولانی است',
    EMAIL_INVALID: 'آدرس ایمیل نامعتبر است',
    SUBJECT_TOO_SHORT: 'موضوع خیلی کوتاه است',
    MESSAGE_TOO_SHORT: 'پیام خیلی کوتاه است',
    SOMETHING_WENT_WRONG: 'مشکلی پیش آمد، لطفاً دوباره تلاش کنید.',
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