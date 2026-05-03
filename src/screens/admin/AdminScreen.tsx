import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Firestore imports for real-time tracking
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

// Define the menu item structure
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
  accent: string;
}

export default function AdminScreen({ navigation }: any) {
  // Real-time states for operational metrics
  const [pendingCount, setPendingCount] = useState(0);
  const [washingCount, setWashingCount] = useState(0);

  // Setup real-time listeners for bookings
  useEffect(() => {
    // Query for jobs that are currently active (not yet finished)
    const q = query(
      collection(db, 'bookings'),
      where('status', 'in', ['Pending', 'Washing'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data());
      
      // Calculate counts based on specific status
      const pending = docs.filter(d => d.status === 'Pending').length;
      const washing = docs.filter(d => d.status === 'Washing').length;

      setPendingCount(pending);
      setWashingCount(washing);
    }, (error) => {
      console.error("Error syncing dashboard metrics:", error);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(err => console.log(err));
  };

  // Dashboard navigation buttons configuration
  const MENU_ITEMS: MenuItem[] = [
    { id: '1', label: 'Revenue Reports', icon: '💰', screen: 'RevenueReports', accent: '#8B5CF6' },
    { id: '2', label: 'Staff Management', icon: '👥', screen: 'StaffManagement', accent: '#3B82F6' },
    { id: '3', label: 'Analytics', icon: '📊', screen: 'Analytics', accent: '#F59E0B' },
    { id: '4', label: 'Service Settings', icon: '⚙️', screen: 'ServiceSettings', accent: '#10B981' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Logout */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Admin Dashboard</Text>
          <Text style={styles.dateText}>Real-time Monitoring</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionLabel}>Operations Overview</Text>

        {/* Operational Performance Card (Real-time) */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeader}>CURRENT WORKSHOP LOAD</Text>
          <View style={styles.statsRow}>
            {/* Real-time Washing Count */}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{washingCount}</Text>
              <Text style={styles.statLabel}>Washing</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            {/* Real-time Pending Count */}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Combined Efficiency Metric (Mock calculation) */}
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>High</Text>
              <Text style={styles.statLabel}>Efficiency</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Management Menu</Text>

        {/* Navigation Grid */}
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.gridCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.accent + '15' }]}>
                <Text style={styles.gridIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={styles.gridArrow}>View →</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Original Dark Theme Colors
  safe: { flex: 1, backgroundColor: '#0F172A' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 20,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  dateText: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  logoutBtn: { backgroundColor: '#334155', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  logoutText: { color: '#F87171', fontWeight: 'bold', fontSize: 13 },

  scrollContent: { padding: 20 },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#94A3B8', 
    textTransform: 'uppercase', 
    letterSpacing: 1.2, 
    marginBottom: 16,
    marginTop: 10,
  },

  // Operational Card (Dark Style)
  mainCard: { 
    backgroundColor: '#1E293B', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 5,
  },
  cardHeader: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: 'bold' },
  statDivider: { width: 1, height: 30, backgroundColor: '#334155' },

  // Menu Grid (Keeping the dark theme feel)
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { 
    width: '47%', 
    backgroundColor: '#1E293B', // Darker background for cards
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gridIcon: { fontSize: 20 },
  gridLabel: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  gridArrow: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
});