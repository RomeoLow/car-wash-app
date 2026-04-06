import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen({ onLogin }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car Wash System</Text>
      <Text style={styles.subtitle}>Select a Role to Login (Dev Mode)</Text>

      <TouchableOpacity style={[styles.btn, {backgroundColor: '#2196F3'}]} onPress={() => onLogin('customer')}>
        <Text style={styles.btnText}>Login as Customer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {backgroundColor: '#4CAF50'}]} onPress={() => onLogin('worker')}>
        <Text style={styles.btnText}>Login as Worker</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {backgroundColor: '#FF9800'}]} onPress={() => onLogin('admin')}>
        <Text style={styles.btnText}>Login as Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', marginBottom: 40, color: '#666' },
  btn: { padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});