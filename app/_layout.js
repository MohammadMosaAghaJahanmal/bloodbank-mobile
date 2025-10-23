// app\_layout.js
import bbStore from '@/store/bbStore';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../contexts/LanguageContext';
import AuthProvider from '../contexts/authContext';
bbStore();
export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(drawer)" />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </LanguageProvider>
  );
}