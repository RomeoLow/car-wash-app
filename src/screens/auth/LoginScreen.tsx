import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
// Firebase Imports
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    // Basic Validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter an email and password.");
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        // 1. Registration Logic
        if (!name) {
          Alert.alert("Error", "Please enter your full name.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // Update Auth Profile so displayName is available globally
        await updateProfile(user, { displayName: name });

        // Save profile to Firestore with 'customer' role
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: 'customer', // Default role for new signups
          loyaltyPoints: 0,
          vehicles: [],
          createdAt: new Date().toISOString()
        });

        Alert.alert("Account Created", `Welcome to the team, ${name}!`);
      } else {
        // 2. Login Logic
        await signInWithEmailAndPassword(auth, email.trim(), password);
        // Note: No navigation needed here! 
        // Your App.tsx listener will detect the login and swap screens.
      }
    } catch (error: any) {
      // Clean up Firebase error messages for the user
      let errorMessage = "An unexpected error occurred.";

      if (error.code === 'auth/invalid-email') errorMessage = "Invalid email address format.";
      if (error.code === 'auth/user-not-found') errorMessage = "No account found with this email.";
      if (error.code === 'auth/wrong-password') errorMessage = "Incorrect password.";
      if (error.code === 'auth/email-already-in-use') errorMessage = "This email is already registered.";

      Alert.alert("Authentication Failed", errorMessage);
      console.error(error.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Car Wash System</Text>
        <Text style={styles.subtitle}>
          {isRegistering ? 'Create a new account' : 'Sign in to continue'}
        </Text>

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#B0BEC5' }]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isRegistering ? 'Register' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <Text style={styles.toggleText}>
            {isRegistering
              ? 'Already have an account? Sign In'
              : 'Need an account? Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  toggleText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600'
  }
});