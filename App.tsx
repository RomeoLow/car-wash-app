// App.tsx
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
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
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", authenticatedUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole('customer');
          }
          setUser(authenticatedUser);
        } catch (error) {
          console.error("Error fetching user role:", error);
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5B8DEF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {/* If Not Logged In */}
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) :

          /* If Logged In as Admin */
          role === 'admin' ? (
            <Stack.Screen name="AdminHome" component={AdminScreen} />
          ) :

          /* If Logged In as Worker */
          role === 'worker' ? (
            <>
              <Stack.Screen name="WorkerHome" component={TaskQueueScreen} />
              <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />
            </>
          ) :

          /* If Logged In as Customer (Default) */
          (
            <>
              <Stack.Screen name="BookingScreen" component={BookingScreen} />
              <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}