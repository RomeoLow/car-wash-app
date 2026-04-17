import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Screen Imports (Make sure these paths match your folder structure)
import LoginScreen from './src/screens/auth/LoginScreen';
import AdminScreen from './src/screens/admin/AdminScreen';
import BookingScreen from './src/screens/customer/BookingScreen';
import TaskQueueScreen from './src/screens/worker/TaskQueueScreen';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Real-time listener for Auth state
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        try {
          // 2. Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, "users", authenticatedUser.uid));
          
          if (userDoc.exists()) {
            setRole(userDoc.data().role); // Sets 'admin', 'worker', or 'customer'
          } else {
            setRole('customer'); // Default if no doc exists
          }
          setUser(authenticatedUser);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        // Reset states on logout
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  // Show a loading spinner while checking login status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // 3. Conditional Rendering (The "Who is Who" logic)
  if (!user) {
    return <LoginScreen />;
  }

  // Once logged in, show the screen based on their role
  switch (role) {
    case 'admin':
      return <AdminScreen />;
    case 'worker':
      return <TaskQueueScreen />;
    case 'customer':
      return <BookingScreen />;
    default:
      return <BookingScreen />; // Safety fallback
  }
}