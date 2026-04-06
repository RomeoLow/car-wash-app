import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Alert, TouchableOpacity } from 'react-native';

// Import Screens from sub-folders
import LoginScreen from './src/screens/auth/LoginScreen';
import BookingScreen from './src/screens/customer/BookingScreen';
import TaskQueueScreen from './src/screens/worker/TaskQueueScreen';
import AdminScreen from './src/screens/admin/AdminScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Authentication Logic
  const handleAuth = (email: string) => {
    const lowerEmail = email.toLowerCase().trim();
    if (!lowerEmail.includes('@')) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    setUserEmail(lowerEmail);
    if (lowerEmail === 'admin@carwash.com') {
      setUserRole('admin');
    } else if (lowerEmail.endsWith('@worker.com')) {
      setUserRole('worker');
    } else {
      setUserRole('customer');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserEmail('');
  };

  if (!userRole) {
    return <LoginScreen onLogin={handleAuth} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2196F3',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={24} color="red" />
            </TouchableOpacity>
          ),
        }}
      >
        {userRole === 'customer' && (
          <Tab.Screen 
            name="Booking" 
            component={BookingScreen} 
            options={{ title: 'Book Wash', tabBarIcon: ({color}) => <Ionicons name="car" size={24} color={color}/> }} 
          />
        )}
        {userRole === 'worker' && (
          <Tab.Screen 
            name="Tasks" 
            component={TaskQueueScreen} 
            options={{ title: 'Job Queue', tabBarIcon: ({color}) => <Ionicons name="list" size={24} color={color}/> }} 
          />
        )}
        {userRole === 'admin' && (
          <Tab.Screen 
            name="Admin" 
            component={AdminScreen} 
            options={{ title: 'Dashboard', tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={24} color={color}/> }} 
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}