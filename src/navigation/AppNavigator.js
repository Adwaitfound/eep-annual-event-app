import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // User is not authenticated
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !userProfile?.organization ? (
          // User is authenticated but profile is incomplete
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          // User is authenticated and profile is complete
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
