import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function AdminScreen() {
  const handleLogout = () => signOut(auth);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.adminBadge}>ADMIN PANEL</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Management Dashboard</Text>

      {/* TEAMMATE STARTS HERE: Add Revenue Charts, Staff Management, etc. */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.icon}>💰</Text>
          <Text style={styles.gridLabel}>Daily Revenue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.icon}>👥</Text>
          <Text style={styles.gridLabel}>Manage Staff</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.icon}>📊</Text>
          <Text style={styles.gridLabel}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}>
          <Text style={styles.icon}>⚙️</Text>
          <Text style={styles.gridLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 20 },
  adminBadge: { backgroundColor: '#673AB7', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, fontSize: 12, fontWeight: 'bold' },
  logoutText: { color: '#F44336', fontWeight: 'bold' },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '47%', backgroundColor: '#fff', padding: 25, borderRadius: 20, marginBottom: 20, alignItems: 'center', elevation: 2 },
  icon: { fontSize: 30, marginBottom: 10 },
  gridLabel: { fontWeight: '600', color: '#555' }
});