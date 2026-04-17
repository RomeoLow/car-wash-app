import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function TaskQueueScreen() {
  const handleLogout = () => signOut(auth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.roleTag}>WORKER MODE</Text>
          <Text style={styles.title}>Job Queue</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* TEAMMATE STARTS HERE: Use Firestore onSnapshot to list active bookings */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNum}>0</Text><Text>Pending</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>0</Text><Text>Washing</Text></View>
      </View>

      <View style={styles.listContainer}>
         <Text style={styles.placeholderText}>[Insert Real-time Task List Here]</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  roleTag: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  logoutText: { color: '#FF5252', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  listContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#333' },
  placeholderText: { color: '#666' }
});