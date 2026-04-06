import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginScreen({ onLogin }: any) {
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Car Wash System</Text>
        <Text style={styles.subtitle}>Enter email to Sign In or Register</Text>
        
        <TextInput 
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={() => onLogin(email)}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.guide}>
          <Text style={styles.guideText}>Admin: admin@carwash.com</Text>
          <Text style={styles.guideText}>Worker: name@worker.com</Text>
          <Text style={styles.guideText}>Customer: any other email</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'center', padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2196F3', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#2196F3', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  guide: { marginTop: 40, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 },
  guideText: { color: '#888', fontSize: 12, textAlign: 'center', marginBottom: 5 }
});