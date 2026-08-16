import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { DriveProvider } from '../context/DriveContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutContent() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DriveProvider>
          <RootLayoutContent />
        </DriveProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
