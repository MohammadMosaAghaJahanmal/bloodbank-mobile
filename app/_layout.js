// app_layout.js
import bbStore from '@/store/bbStore';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthProvider from '../contexts/authContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { NetworkAwareContent, NetworkProvider } from '../contexts/NetworkContext';


bbStore();

export default function RootLayout() {
  return (
    <NetworkProvider>
      <LanguageProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <NetworkAwareContent>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(drawer)" />
                </Stack>
              </NetworkAwareContent>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </AuthProvider>
      </LanguageProvider>
    </NetworkProvider>
  );
}