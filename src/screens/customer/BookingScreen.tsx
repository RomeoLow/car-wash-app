import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function BookingScreen() {
  const handleLogout = () => signOut(auth);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Car Wash</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.welcome}>Hello, {auth.currentUser?.displayName || 'Customer'}!</Text>
        <Text style={styles.subtitle}>Keep your car shining today.</Text>
      </View>

      {/* TEAMMATE STARTS HERE: Add Booking Form, Service Selection, etc. */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Book a Service</Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>[Insert Booking Form / Service Selection Here]</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2196F3' },
  logoutBtn: { padding: 5 },
  logoutText: { color: '#F44336', fontWeight: 'bold' },
  banner: { padding: 25, backgroundColor: '#2196F3' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#E3F2FD', marginTop: 5 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  placeholderCard: { height: 200, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#ccc' },
  placeholderText: { color: '#999' }
});