import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SpeakersListScreen from '../screens/speakers/SpeakersListScreen';
import ParticipantsScreen from '../screens/networking/ParticipantsScreen';
import EventInfoScreen from '../screens/info/EventInfoScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Speakers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Network') {
            iconName = focused ? 'git-network' : 'git-network-outline';
          } else if (route.name === 'Info') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Schedule" 
        component={ScheduleScreen}
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen 
        name="Speakers" 
        component={SpeakersListScreen}
        options={{ title: 'Speakers' }}
      />
      <Tab.Screen 
        name="Network" 
        component={ParticipantsScreen}
        options={{ title: 'Network' }}
      />
      <Tab.Screen 
        name="Info" 
        component={EventInfoScreen}
        options={{ title: 'Event Info' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
