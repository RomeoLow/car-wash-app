// src/screens/customer/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../firebaseConfig';
import { signOut, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

type Stats = {
  total: number;
  pending: number;
  done: number;
  totalSpent: number;
};

const AVATAR_COLORS = ['#5B8DEF', '#A78BFA', '#34D399', '#FB923C', '#F472B6'];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function ProfileScreen({ navigation }: any) {
  const user = auth.currentUser;
  const displayName = user?.displayName || 'Customer';
  const email = user?.email || '';
  const avatarColor = getAvatarColor(displayName);

  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => d.data());
        setStats({
          total: docs.length,
          pending: docs.filter(d => d.status === 'Pending').length,
          done: docs.filter(d => d.status === 'Done').length,
          totalSpent: docs.filter(d => d.status === 'Done').reduce((s, d) => s + (d.totalPrice || 0), 0),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStats(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut(auth) },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>My Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Avatar + Name */}
        <View style={s.avatarSection}>
          <View style={[s.avatar, { backgroundColor: avatarColor }]}>
            <Text style={s.avatarText}>{getInitials(displayName)}</Text>
          </View>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.email}>{email}</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {loadingStats ? (
            <ActivityIndicator color="#5B8DEF" style={{ flex: 1 }} />
          ) : (
            <>
              <View style={s.statBox}>
                <Text style={s.statNum}>{stats?.total ?? 0}</Text>
                <Text style={s.statLabel}>Total</Text>
              </View>
              <View style={[s.statBox, s.statDivider]}>
                <Text style={[s.statNum, { color: '#34D399' }]}>{stats?.done ?? 0}</Text>
                <Text style={s.statLabel}>Completed</Text>
              </View>
              <View style={s.statBox}>
                <Text style={[s.statNum, { color: '#F59E0B' }]}>{stats?.pending ?? 0}</Text>
                <Text style={s.statLabel}>Pending</Text>
              </View>
            </>
          )}
        </View>

        {/* Total Spent */}
        {stats && stats.totalSpent > 0 && (
          <View style={s.spentCard}>
            <Text style={s.spentLabel}>💰 Total Spent</Text>
            <Text style={s.spentAmount}>RM {stats.totalSpent}</Text>
          </View>
        )}

        {/* Account Info */}
        <Text style={s.sectionLabel}>Account</Text>
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>👤</Text>
            <View style={s.infoContent}>
              <Text style={s.infoLabel}>Display Name</Text>
              <Text style={s.infoValue}>{displayName}</Text>
            </View>
          </View>
          <View style={s.infoDivider} />
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>📧</Text>
            <View style={s.infoContent}>
              <Text style={s.infoLabel}>Email</Text>
              <Text style={s.infoValue}>{email}</Text>
            </View>
          </View>
          <View style={s.infoDivider} />
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>🔑</Text>
            <View style={s.infoContent}>
              <Text style={s.infoLabel}>User ID</Text>
              <Text style={[s.infoValue, { fontSize: 11, color: '#5A5A78' }]}>{user?.uid}</Text>
            </View>
          </View>
        </View>

        {/* My Bookings */}
        <Text style={s.sectionLabel}>Quick Actions</Text>
        <TouchableOpacity style={s.historyBtn} onPress={() => navigation.navigate('HistoryScreen')}>
          <Text style={s.historyBtnIcon}>📋</Text>
          <Text style={s.historyBtnText}>View My Bookings</Text>
          <Text style={s.historyBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>🚪  Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  scroll: { paddingBottom: 60 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#1C1C2E', borderBottomWidth: 1, borderBottomColor: '#2E2E4E',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2E2E4E', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { color: '#5B8DEF', fontSize: 18, fontWeight: 'bold' },

  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  email: { fontSize: 14, color: '#9090A8' },

  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 16,
    backgroundColor: '#1C1C2E', borderRadius: 16, borderWidth: 1, borderColor: '#2E2E4E',
    overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#2E2E4E' },
  statNum: { fontSize: 24, fontWeight: '900', color: '#5B8DEF', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#9090A8', fontWeight: '600' },

  spentCard: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: '#1C1C2E', borderRadius: 16, borderWidth: 1, borderColor: '#2E2E4E',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  spentLabel: { fontSize: 14, color: '#9090A8', fontWeight: '600' },
  spentAmount: { fontSize: 22, fontWeight: '900', color: '#34D399' },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#9090A8', letterSpacing: 1,
    textTransform: 'uppercase', marginHorizontal: 16, marginBottom: 10, marginTop: 8,
  },

  infoCard: {
    marginHorizontal: 16, marginBottom: 24,
    backgroundColor: '#1C1C2E', borderRadius: 16, borderWidth: 1, borderColor: '#2E2E4E',
    overflow: 'hidden',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  infoIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#9090A8', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#fff', fontWeight: '600' },
  infoDivider: { height: 1, backgroundColor: '#2E2E4E', marginHorizontal: 16 },

  historyBtn: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 20, backgroundColor: '#1C1C2E', borderWidth: 1, borderColor: '#2E2E4E',
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  historyBtnIcon: { fontSize: 18 },
  historyBtnText: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 15 },
  historyBtnArrow: { color: '#5B8DEF', fontSize: 18, fontWeight: '700' },

  logoutBtn: {
    marginHorizontal: 16, borderRadius: 14, paddingVertical: 16,
    backgroundColor: '#2E1A1A', borderWidth: 1, borderColor: '#4A1A1A',
    alignItems: 'center',
  },
  logoutText: { color: '#F87171', fontWeight: '700', fontSize: 15 },
});