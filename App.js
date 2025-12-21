import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { ScheduleProvider } from './src/context/ScheduleContext';
import { NetworkingProvider } from './src/context/NetworkingContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ScheduleProvider>
            <NetworkingProvider>
              <AppNavigator />
              <StatusBar style="auto" />
            </NetworkingProvider>
          </ScheduleProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
