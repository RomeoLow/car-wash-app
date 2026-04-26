// src/screens/customer/HistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, RefreshControl, StatusBar, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

type Booking = {
  id: string;
  plate: string;
  size: string;
  serviceName: string;
  extras: string[];
  totalPrice: number;
  status: 'Pending' | 'Washing' | 'Done';
  createdAt: any;
};

const STATUS_CONFIG = {
  Pending:  { color: '#F59E0B', bg: '#2A1F0A', icon: '⏳', label: 'Pending' },
  Washing:  { color: '#5B8DEF', bg: '#0A1525', icon: '🚿', label: 'Washing' },
  Done:     { color: '#34D399', bg: '#0A2018', icon: '✅', label: 'Done' },
};

function formatDate(ts: any): string {
  if (!ts) return '—';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });
}

function BookingCard({ item, onPress }: { item: Booking; onPress: () => void }) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.Pending;
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <View style={s.cardTop}>
        <View style={s.plateBox}>
          <Text style={s.plateText}>{item.plate}</Text>
          <Text style={s.sizeTag}>{item.size}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={s.statusIcon}>{cfg.icon}</Text>
          <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>
      <View style={s.cardMid}>
        <Text style={s.serviceName}>{item.serviceName}</Text>
        {item.extras && item.extras.length > 0 && (
          <Text style={s.extrasText}>+ {item.extras.join(', ')}</Text>
        )}
      </View>
      <View style={s.cardBottom}>
        <Text style={s.dateText}>{formatDate(item.createdAt)}</Text>
        <Text style={s.price}>RM {item.totalPrice}</Text>
      </View>
      {/* Progress bar for active jobs */}
      {item.status !== 'Done' && (
        <View style={s.progressTrack}>
          <View style={[
            s.progressFill,
            { width: item.status === 'Washing' ? '60%' : '15%', backgroundColor: cfg.color }
          ]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HistoryScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Removed the 'orderBy' to fix the Firebase composite index error
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', auth.currentUser.uid)
    );
    
    const unsub = onSnapshot(q, snap => {
      let fetchedBookings = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
      
      // Sort the bookings locally (newest first)
      fetchedBookings.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA; 
      });

      setBookings(fetchedBookings);
      setLoading(false);
      setRefreshing(false);
    });
    
    return unsub;
  }, []);

  const active = bookings.filter(b => b.status !== 'Done');
  const past   = bookings.filter(b => b.status === 'Done');

  const renderHeader = () => (
    <>
      {active.length > 0 && (
        <>
          <Text style={s.sectionLabel}>🔵 Active</Text>
          {active.map(item => (
            <BookingCard key={item.id} item={item} onPress={() => {}} />
          ))}
          <Text style={s.sectionLabel}>✅ Past</Text>
        </>
      )}
    </>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Bookings</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#5B8DEF" size="large" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyIcon}>🚗</Text>
          <Text style={s.emptyTitle}>No bookings yet</Text>
          <Text style={s.emptySubtitle}>Your wash history will appear here.</Text>
          <TouchableOpacity style={s.bookNowBtn} onPress={() => navigation.goBack()}>
            <Text style={s.bookNowText}>Book a Wash →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={past}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <BookingCard item={item} onPress={() => {}} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
              tintColor="#5B8DEF"
            />
          }
          ListEmptyComponent={
            active.length > 0 ? null : (
              <Text style={s.emptySubtitle}>No past bookings.</Text>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#1C1C2E', borderBottomWidth: 1, borderBottomColor: '#2E2E4E',
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2E2E4E', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#5B8DEF', fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },

  list: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9090A8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },

  card: {
    backgroundColor: '#1C1C2E', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#2E2E4E',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  plateBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plateText: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 1.5 },
  sizeTag: { backgroundColor: '#2E2E4E', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  statusIcon: { fontSize: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },

  cardMid: { marginBottom: 10 },
  serviceName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  extrasText: { fontSize: 12, color: '#9090A8', marginTop: 2 },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { fontSize: 12, color: '#5A5A78' },
  price: { fontSize: 18, fontWeight: '800', color: '#fff' },

  progressTrack: { height: 3, backgroundColor: '#2E2E4E', borderRadius: 2, marginTop: 12 },
  progressFill: { height: 3, borderRadius: 2 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#9090A8', textAlign: 'center', marginBottom: 24 },
  bookNowBtn: { backgroundColor: '#5B8DEF', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  bookNowText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});