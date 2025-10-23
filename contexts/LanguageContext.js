// contexts/LanguageContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nManager, Platform } from 'react-native';
import { changeLanguage, getSystemLanguage, isRTL } from '../utils/i18n';

const LanguageContext = createContext();

const STORAGE_KEY = 'app_language';

export const LanguageProvider = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState('en');
  const [rtl, setRTL] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load saved language on app start
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  // Apply RTL settings when RTL state changes
  useEffect(() => {
    if (isReady) {
      applyRTLSettings();
    }
  }, [rtl, isReady]);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (savedLanguage) {
        // Use saved language
        const newRTL = isRTL(savedLanguage);
        setCurrentLocale(savedLanguage);
        setRTL(newRTL);
        changeLanguage(savedLanguage);
      } else {
        // Use system language
        const systemLanguage = getSystemLanguage();
        const systemRTL = isRTL(systemLanguage);
        setCurrentLocale(systemLanguage);
        setRTL(systemRTL);
        changeLanguage(systemLanguage);
      }
    } catch (error) {
      console.log('Error loading language:', error);
      // Fallback to system language
      const systemLanguage = getSystemLanguage();
      const systemRTL = isRTL(systemLanguage);
      setCurrentLocale(systemLanguage);
      setRTL(systemRTL);
      changeLanguage(systemLanguage);
    } finally {
      setIsReady(true);
    }
  };

  const applyRTLSettings = () => {
    // Force RTL/LTR layout
    I18nManager.forceRTL(rtl);
    
    // This is important for some Android devices
    if (Platform.OS === 'android') {
      // You might need to restart the app on Android for RTL to take full effect
      console.log('RTL settings applied:', { rtl, currentLocale });
    }
  };

  const toggleLanguage = async (locale) => {
    try {
      const newRTL = isRTL(locale);
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEY, locale);
      
      // Update state
      setCurrentLocale(locale);
      setRTL(newRTL);
      changeLanguage(locale);
      
      // Force re-render of all components
      applyRTLSettings();
      
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