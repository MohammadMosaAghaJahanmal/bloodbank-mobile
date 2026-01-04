// components/RTLInitializer.js
import { useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export default function RTLInitializer({ children }) {
  const { isRTL, isReady } = useLanguage();

  useEffect(() => {
    if (isReady) {
      console.log('Applying RTL Settings:', { isRTL, platform: Platform.OS });
      
      // Force RTL settings - this is crucial
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
      
      if (Platform.OS === 'android') {
        I18nManager.swapLeftAndRightInRTL(isRTL);
      }

      setTimeout(() => {
      }, 100);
    }
  }, [isRTL, isReady]);

  if (!isReady) {
    return null;
  }

  return children;
}