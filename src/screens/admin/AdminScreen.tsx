// src/screens/admin/AdminScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
  accent: string;
}

export default function AdminScreen({ navigation }: any): React.JSX.Element {
  const [washingCount, setWashingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const washingUnsub = onSnapshot(
      query(collection(db, 'bookings'), where('status', '==', 'Washing')),
      snap => setWashingCount(snap.size)
    );
    const pendingUnsub = onSnapshot(
      query(collection(db, 'bookings'), where('status', '==', 'Pending')),
      snap => setPendingCount(snap.size)
    );
    return () => { washingUnsub(); pendingUnsub(); };
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(err => console.log(err));
  };

  const menuItems: MenuItem[] = [
    { id: 'revenue',  label: 'Daily Revenue', icon: '💰', screen: 'RevenueReports',  accent: '#10B981' },
    { id: 'staff',    label: 'Manage Staff',  icon: '👥', screen: 'StaffManagement', accent: '#3B82F6' },
    { id: 'reports',  label: 'Reports',       icon: '📊', screen: 'RevenueReports',  accent: '#F59E0B' },
    { id: 'settings', label: 'Pricing',       icon: '💲', screen: 'ServiceSettings', accent: '#8B5CF6' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Text style={styles.adminBadge}>ADMIN PANEL</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Operations Overview</Text>

        {/* Workshop Load Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeader}>CURRENT WORKSHOP LOAD</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{washingCount}</Text>
              <Text style={styles.statLabel}>Washing</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>High</Text>
              <Text style={styles.statLabel}>Efficiency</Text>
            </View>
          </View>
        </View>

        {/* Feature Grid */}
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              activeOpacity={0.8}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.accent + '20' }]}>
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
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 15, marginBottom: 20,
  },
  badgeContainer: { alignSelf: 'flex-start' },
  adminBadge: {
    backgroundColor: '#673AB7', color: '#fff',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, fontSize: 12, fontWeight: 'bold', overflow: 'hidden',
  },
  logoutText: { color: '#F44336', fontWeight: 'bold', fontSize: 16 },

  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: '#888',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
  },

  mainCard: {
    backgroundColor: '#673AB7', borderRadius: 24, padding: 20,
    marginBottom: 24, elevation: 8,
    shadowColor: '#673AB7', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 10,
  },
  cardHeader: {
    color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', paddingBottom: 40,
  },
  gridItem: {
    width: '47%', backgroundColor: '#fff', paddingVertical: 22,
    borderRadius: 20, marginBottom: 16, alignItems: 'center',
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  iconBox: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  gridIcon: { fontSize: 28 },
  gridLabel: { fontWeight: 'bold', color: '#333', fontSize: 13, marginBottom: 4 },
  gridArrow: { fontSize: 11, color: '#999' },
});