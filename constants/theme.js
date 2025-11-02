/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};


export const AFGHANISTAN_PROVINCES = [
  { id: 'kabul', en: 'Kabul', ps: 'کابل', prs: 'کابل' },
  { id: 'kandahar', en: 'Kandahar', ps: 'کندهار', prs: 'قندهار' },
  { id: 'herat', en: 'Herat', ps: 'هرات', prs: 'هرات' },
  { id: 'balkh', en: 'Balkh', ps: 'بلخ', prs: 'بلخ' },
  { id: 'nangarhar', en: 'Nangarhar', ps: 'ننگرهار', prs: 'ننگرهار' },
  { id: 'helmand', en: 'Helmand', ps: 'هلمند', prs: 'هلمند' },
  { id: 'kunduz', en: 'Kunduz', ps: 'کندز', prs: 'کندز' },
  { id: 'ghazni', en: 'Ghazni', ps: 'غزني', prs: 'غزنی' },
  { id: 'badghis', en: 'Badghis', ps: 'بادغیس', prs: 'بادغیس' },
  { id: 'baghlan', en: 'Baghlan', ps: 'بغلان', prs: 'بغلان' },
  { id: 'bamyan', en: 'Bamyan', ps: 'بامیان', prs: 'بامیان' },
  { id: 'daykundi', en: 'Daykundi', ps: 'دایکندی', prs: 'دایکندی' },
  { id: 'farah', en: 'Farah', ps: 'فراه', prs: 'فراه' },
  { id: 'faryab', en: 'Faryab', ps: 'فاریاب', prs: 'فاریاب' },
  { id: 'ghor', en: 'Ghor', ps: 'غور', prs: 'غور' },
  { id: 'jowzjan', en: 'Jowzjan', ps: 'جوزجان', prs: 'جوزجان' },
  { id: 'khost', en: 'Khost', ps: 'خوست', prs: 'خوست' },
  { id: 'kunar', en: 'Kunar', ps: 'کونړ', prs: 'کنر' },
  { id: 'laghman', en: 'Laghman', ps: 'لغمان', prs: 'لغمان' },
  { id: 'logar', en: 'Logar', ps: 'لوگر', prs: 'لوگر' },
  { id: 'nuristan', en: 'Nuristan', ps: 'نورستان', prs: 'نورستان' },
  { id: 'paktia', en: 'Paktia', ps: 'پکتیا', prs: 'پکتیا' },
  { id: 'paktika', en: 'Paktika', ps: 'پکتیکا', prs: 'پکتیکا' },
  { id: 'panjshir', en: 'Panjshir', ps: 'پنجشیر', prs: 'پنجشیر' },
  { id: 'parwan', en: 'Parwan', ps: 'پروان', prs: 'پروان' },
  { id: 'samangan', en: 'Samangan', ps: 'سمنگان', prs: 'سمنگان' },
  { id: 'sar-e-pol', en: 'Sar-e Pol', ps: 'سرپل', prs: 'سرپل' },
  { id: 'takhar', en: 'Takhar', ps: 'تخار', prs: 'تخار' },
  { id: 'uruzgan', en: 'Uruzgan', ps: 'اروزگان', prs: 'اروزگان' },
  { id: 'wardak', en: 'Wardak', ps: 'وردګ', prs: 'وردک' },
  { id: 'zabul', en: 'Zabul', ps: 'زابل', prs: 'زابل' }
];

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
