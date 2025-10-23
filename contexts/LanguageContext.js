// contexts/LanguageContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nManager, Platform } from 'react-native';
import { changeLanguage, isRTL } from '../utils/i18n';

const LanguageContext = createContext();

const STORAGE_KEY = 'app_language';

export const LanguageProvider = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState('en');
  const [rtl, setRTL] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Apply LTR settings immediately when component mounts
  useEffect(() => {
    // Force LTR on app start
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    if (Platform.OS === 'android') {
      I18nManager.swapLeftAndRightInRTL(false);
    }
  }, []);

  // Load language on app start - ALWAYS START WITH EN
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      // Always start with English, ignore saved language on startup
      await applyLanguage('en', false);
      
      console.log('App started with forced EN language');
    } catch (error) {
      console.log('Error loading language:', error);
      // Fallback to English
      await applyLanguage('en', false);
    } finally {
      setIsReady(true);
    }
  };

  const applyLanguage = async (locale, isRTLValue) => {
    // Update i18n
    changeLanguage(locale);
    
    // Update state
    setCurrentLocale(locale);
    setRTL(isRTLValue);
    
    // Save to storage for future use (user can still change it)
    await AsyncStorage.setItem(STORAGE_KEY, locale);
  };

  const toggleLanguage = async (locale) => {
    try {
      const newRTL = isRTL(locale);
      await applyLanguage(locale, newRTL);
      
      console.log('Language changed to:', locale, 'RTL:', newRTL);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const value = {
    isRTL: rtl,
    currentLocale,
    toggleLanguage,
    isReady
  };

  return (
    <LanguageContext.Provider value={value}>
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