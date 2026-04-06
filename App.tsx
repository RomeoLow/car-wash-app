import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Screens from their new folders
import LoginScreen from './src/screens/auth/LoginScreen';
import BookingScreen from './src/screens/customer/BookingScreen';
import TaskQueueScreen from './src/screens/worker/TaskQueueScreen';
import AdminScreen from './src/screens/admin/AdminScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  // userRole can be: null (not logged in), 'customer', 'worker', or 'admin'
  const [userRole, setUserRole] = useState<string | null>(null);

  // 1. If not logged in, only show the Login Screen
  if (!userRole) {
    return <LoginScreen onLogin={(role: string) => setUserRole(role)} />;
  }

  // 2. If logged in, show the specific Tab Base
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2196F3',
          headerRight: () => (
            <Ionicons 
              name="log-out-outline" 
              size={24} 
              style={{ marginRight: 15 }} 
              onPress={() => setUserRole(null)} 
            />
          ),
        }}
      >
        {userRole === 'customer' && (
          <Tab.Screen 
            name="CustomerHome" 
            component={BookingScreen} 
            options={{ title: 'Book a Wash', tabBarIcon: ({color}) => <Ionicons name="car" size={20} color={color}/> }} 
          />
        )}

        {userRole === 'worker' && (
          <Tab.Screen 
            name="WorkerHome" 
            component={TaskQueueScreen} 
            options={{ title: 'Job Queue', tabBarIcon: ({color}) => <Ionicons name="list" size={20} color={color}/> }} 
          />
        )}

        {userRole === 'admin' && (
          <Tab.Screen 
            name="AdminHome" 
            component={AdminScreen} 
            options={{ title: 'Dashboard', tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={20} color={color}/> }} 
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}