import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Firestore real-time updates[cite: 5]

// Define the structure for dashboard menu items
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
  accent: string;
}

export default function AdminScreen({ navigation }: any) {
  // States for live operational metrics[cite: 5, 11]
  const [pendingCount, setPendingCount] = useState(0);
  const [washingCount, setWashingCount] = useState(0);

  // Sync with Firestore bookings collection[cite: 5]
  useEffect(() => {
    // Filter for jobs currently in the system but not finished
    const q = query(
      collection(db, 'bookings'),
      where('status', 'in', ['Pending', 'Washing'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data());
      // Split counts based on status to give Admin better oversight[cite: 11]
      setPendingCount(docs.filter(d => d.status === 'Pending').length);
      setWashingCount(docs.filter(d => d.status === 'Washing').length);
    });

    return () => unsubscribe();
  }, []);

  // Standard sign out function[cite: 1, 6]
  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  // Grid menu items with unique accent colors for better scannability
  const menuItems: MenuItem[] = [
    { id: 'rev', label: 'Revenue', icon: '💰', screen: 'RevenueReports', accent: '#10B981' },
    { id: 'stf', label: 'Staff List', icon: '👤', screen: 'StaffManagement', accent: '#3B82F6' },
    { id: 'rpt', label: 'Analytics', icon: '📊', screen: 'Analytics', accent: '#8B5CF6' },
    { id: 'set', label: 'Services', icon: '🛠️', screen: 'ServiceSettings', accent: '#64748B' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header: Admin Identity and Logout[cite: 1] */}
        <View style={styles.header}>
          <View style={styles.adminTag}>
            <View style={styles.dot} />
            <Text style={styles.adminTagText}>SYSTEM ADMINISTRATOR</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeTitle}>Operational Info</Text>

        {/* Dashboard Cards: Using a Slate-to-Blue Gradient look */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeader}>Current Workshop Load</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#60A5FA' }]}>{washingCount}</Text>
              <Text style={styles.statLabel}>In-Progress</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Active Staff</Text>
            </View>
          </View>
        </View>

        {/* Action Grid */}
        <Text style={styles.sectionTitle}>Management Tools</Text>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.gridCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconCircle, { backgroundColor: item.accent + '15' }]}>
                <Text style={styles.gridIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.gridText}>{item.label}</Text>
              <View style={[styles.indicator, { backgroundColor: item.accent }]} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' }, // Light Slate background for Admin
  container: { flex: 1, paddingHorizontal: 20 },
  
  // Header Styles
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 20 
  },
  adminTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#334155', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 6 
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  adminTagText: { color: '#F1F5F9', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  logoutBtn: { padding: 4 },
  logoutText: { color: '#64748B', fontWeight: '600', fontSize: 14 },

  welcomeTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 },

  // Operational Card
  mainCard: { 
    backgroundColor: '#1E293B', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  cardHeader: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  statDivider: { width: 1, height: 30, backgroundColor: '#334155' },

  // Grid Menu
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { 
    width: '47%', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16, 
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gridIcon: { fontSize: 24 },
  gridText: { fontSize: 14, fontWeight: '700', color: '#334155' },
  indicator: { position: 'absolute', bottom: 0, left: '40%', right: '40%', height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 }
});