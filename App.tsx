// App.tsx
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Firebase Imports
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth'; // Added 'User' type
import { doc, getDoc } from 'firebase/firestore';

// Screen Imports
import LoginScreen from './src/screens/auth/LoginScreen';
import AdminScreen from './src/screens/admin/AdminScreen';
import BookingScreen from './src/screens/customer/BookingScreen';
import HistoryScreen from './src/screens/customer/HistoryScreen';
import ProfileScreen from './src/screens/customer/ProfileScreen';
import TaskQueueScreen from './src/screens/worker/TaskQueueScreen';
import JobDetailScreen from './src/screens/worker/JobDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null); // Replaced 'any' with 'User'
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", authenticatedUser.uid));
          
          if (userDoc.exists()) {
            // Safely grab the role, fallback to customer if the field is missing
            setRole(userDoc.data()?.role || 'customer');
          } else {
            setRole('customer');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole('customer'); // Safe fallback on network failure
        } finally {
          // Always set the user, even if fetching the role throws an error
          setUser(authenticatedUser); 
        }
      } else {
        // Clear state on logout
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
          
          {/* 1. Unauthenticated Stack */}
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            
            /* 2. Authenticated Routes - Grouped purely by Role */
            <Stack.Group>
              
              {/* ADMIN SCREENS */}
              {role === 'admin' && (
                <Stack.Screen name="AdminHome" component={AdminScreen} />
              )}

              {/* WORKER SCREENS (Checking for 'worker' or 'staff') */}
              {(role === 'worker' || role === 'staff') && (
                <>
                  <Stack.Screen name="WorkerHome" component={TaskQueueScreen} />
                  <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />
                </>
              )}

              {/* CUSTOMER SCREENS (Catch-all default) */}
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
    backgroundColor: '#0D1117' // Added background color to match your dark theme perfectly
  }
});