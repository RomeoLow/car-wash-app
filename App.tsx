// App.tsx
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firebase Imports
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// --- Screen Imports ---
import LoginScreen from './src/screens/auth/LoginScreen';

// Admin Screens
import AdminScreen from './src/screens/admin/AdminScreen';
import AnalyticsScreen from './src/screens/admin/AnalyticsScreen';
import RevenueReportsScreen from './src/screens/admin/RevenueReportsScreen'; 
import StaffManagementScreen from './src/screens/admin/StaffManagementScreen'; 
import ServiceSettingsScreen from './src/screens/admin/ServiceSettingsScreen'; 

// Customer Screens
import BookingScreen from './src/screens/customer/BookingScreen';
import HistoryScreen from './src/screens/customer/HistoryScreen';
import ProfileScreen from './src/screens/customer/ProfileScreen';

// Worker Screens
import TaskQueueScreen from './src/screens/worker/TaskQueueScreen';
import JobDetailScreen from './src/screens/worker/JobDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", authenticatedUser.uid));
          
          if (userDoc.exists()) {
            setRole(userDoc.data()?.role || 'customer');
          } else {
            setRole('customer');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole('customer'); 
        } finally {
          setUser(authenticatedUser); 
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B8DEF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          
          {/* 1. Not logged in. */}
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            
            /* 2. Logged in - Routes distributed based on role. */
            <Stack.Group>
              
              {/* --- Admin routing. (ADMIN) --- */}
              {role === 'admin' && (
                <>
                  <Stack.Screen name="AdminHome" component={AdminScreen} />
                  {/* The following three lines are crucial: they must be registered for the buttons in AdminScreen to work */}
                  <Stack.Screen name="RevenueReports" component={RevenueReportsScreen} />
                  <Stack.Screen name="StaffManagement" component={StaffManagementScreen} />
                  <Stack.Screen name="Analytics" component={AnalyticsScreen} />
                  <Stack.Screen name="ServiceSettings" component={ServiceSettingsScreen} />
                </>
              )}

              {/* --- Worker/Staff routing. (WORKER/STAFF) --- */}
              {(role === 'worker' || role === 'staff') && (
                <>
                  <Stack.Screen name="WorkerHome" component={TaskQueueScreen} />
                  <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />
                </>
              )}

              {/* --- Customer routing. (CUSTOMER) --- */}
              {(role === 'customer' || (role !== 'admin' && role !== 'worker' && role !== 'staff')) && (
                <>
                  <Stack.Screen name="BookingScreen" component={BookingScreen} />
                  <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
                  <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                </>
              )}

            </Stack.Group>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#0D1117' 
  }
});