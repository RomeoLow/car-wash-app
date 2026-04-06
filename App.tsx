import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Screen Files
import LoginScreen from './src/screens/auth/LoginScreen';
import BookingScreen from './src/screens/customer/BookingScreen';
import AdminScreen from './src/screens/admin/AdminScreen';
import TaskQueueScreen from './src/screens/worker/TaskQueueScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
  {/* Everyone sees their own tab for development */}
  <Tab.Screen name="Customer" component={BookingScreen} options={{ title: 'Customer Base' }} />
  <Tab.Screen name="Worker" component={TaskQueueScreen} options={{ title: 'Worker Base' }} />
  <Tab.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Base' }} />
</Tab.Navigator>
    </NavigationContainer>
  );
}