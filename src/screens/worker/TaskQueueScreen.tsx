// src/screens/worker/TaskQueueScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, StatusBar, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

type Booking = {
  id: string;
  plate: string;
  size: string;
  serviceName: string;
  customerName: string;
  extras: string[];
  totalPrice: number;
  status: 'Pending' | 'Washing' | 'Done';
  createdAt: any;
};

const STATUS_CONFIG = {
  Pending: { color: '#F59E0B', bg: '#2A1F0A', icon: '⏳', next: 'Washing', nextLabel: 'Start Washing' },
  Washing: { color: '#5B8DEF', bg: '#0A1525', icon: '🚿', next: 'Done',    nextLabel: 'Mark Done' },
  Done:    { color: '#34D399', bg: '#0A2018', icon: '✅', next: null,       nextLabel: '' },
};

function formatTime(ts: any): string {
  if (!ts) return '—';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' });
}

function JobCard({ item, onPress, onStatusChange }: {
  item: Booking;
  onPress: () => void;
  onStatusChange: (id: string, next: string) => void;
}) {
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.Pending;
  return (
    <TouchableOpacity style={[s.card, item.status === 'Washing' && s.cardActive]} onPress={onPress} activeOpacity={0.85}>
      <View style={s.cardHeader}>
        <View style={s.plateRow}>
          <Text style={s.plateText}>{item.plate}</Text>
          <View style={s.sizeChip}>
            <Text style={s.sizeChipText}>{item.size}</Text>
          </View>
        </View>
        <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={s.statusIcon}>{cfg.icon}</Text>
          <Text style={[s.statusLabel, { color: cfg.color }]}>{item.status}</Text>
        </View>
      </View>

      <Text style={s.serviceName}>{item.serviceName}</Text>
      {item.extras?.length > 0 && (
        <Text style={s.extrasText}>+ {item.extras.join(' · ')}</Text>
      )}

      <View style={s.cardFooter}>
        <View>
          <Text style={s.customerName}>👤 {item.customerName}</Text>
          <Text style={s.timeText}>🕐 {formatTime(item.createdAt)}</Text>
        </View>
        <Text style={s.price}>RM {item.totalPrice}</Text>
      </View>

      {cfg.next && (
        <TouchableOpacity
          style={[s.actionBtn, { backgroundColor: cfg.color }]}
          onPress={() => onStatusChange(item.id, cfg.next!)}
        >
          <Text style={s.actionBtnText}>{cfg.nextLabel} →</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default function TaskQueueScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'done'>('active');

  useEffect(() => {
    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleStatusChange = async (id: string, next: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: next });
    } catch (e) {
      console.error('Status update failed:', e);
    }
  };

  const pending  = bookings.filter(b => b.status === 'Pending');
  const washing  = bookings.filter(b => b.status === 'Washing');
  const done     = bookings.filter(b => b.status === 'Done');
  const active   = [...washing, ...pending];
  const displayed = tab === 'active' ? active : done;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.workerTag}>⚡ WORKER MODE</Text>
          <Text style={s.title}>Job Queue</Text>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={() => signOut(auth)}>
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={[s.statNum, { color: '#F59E0B' }]}>{pending.length}</Text>
          <Text style={s.statLabel}>⏳ Pending</Text>
        </View>
        <View style={[s.statBox, s.statMid]}>
          <Text style={[s.statNum, { color: '#5B8DEF' }]}>{washing.length}</Text>
          <Text style={s.statLabel}>🚿 Washing</Text>
        </View>
        <View style={s.statBox}>
          <Text style={[s.statNum, { color: '#34D399' }]}>{done.length}</Text>
          <Text style={s.statLabel}>✅ Done</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        <TouchableOpacity
          style={[s.tab, tab === 'active' && s.tabActive]}
          onPress={() => setTab('active')}
        >
          <Text style={[s.tabText, tab === 'active' && s.tabTextActive]}>
            Active ({active.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tab, tab === 'done' && s.tabActive]}
          onPress={() => setTab('done')}
        >
          <Text style={[s.tabText, tab === 'done' && s.tabTextActive]}>
            Completed ({done.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color="#5B8DEF" size="large" />
        </View>
      ) : displayed.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyIcon}>{tab === 'active' ? '🎉' : '📋'}</Text>
          <Text style={s.emptyText}>
            {tab === 'active' ? 'No active jobs right now!' : 'No completed jobs yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <JobCard
              item={item}
              onPress={() => navigation.navigate('JobDetailScreen', { job: item })}
              onStatusChange={handleStatusChange}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1117' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#161B22', borderBottomWidth: 1, borderBottomColor: '#21262D',
  },
  workerTag: { fontSize: 11, fontWeight: '700', color: '#34D399', letterSpacing: 1, marginBottom: 2 },
  title: { fontSize: 22, fontWeight: '900', color: '#fff' },
  logoutBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#2D1515' },
  logoutText: { color: '#F87171', fontWeight: '700', fontSize: 13 },

  statsRow: {
    flexDirection: 'row', margin: 16, marginBottom: 0,
    backgroundColor: '#161B22', borderRadius: 16,
    borderWidth: 1, borderColor: '#21262D', overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#21262D' },
  statNum: { fontSize: 26, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#8B949E', fontWeight: '600' },

  tabs: {
    flexDirection: 'row', marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    backgroundColor: '#161B22', borderRadius: 12, padding: 4,
    borderWidth: 1, borderColor: '#21262D',
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#21262D' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#8B949E' },
  tabTextActive: { color: '#fff' },

  list: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: '#161B22', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#21262D',
  },
  cardActive: { borderColor: '#5B8DEF', borderWidth: 1.5 },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plateText: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1.5 },
  sizeChip: { backgroundColor: '#21262D', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  sizeChipText: { color: '#8B949E', fontSize: 12, fontWeight: '700' },

  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  statusIcon: { fontSize: 12 },
  statusLabel: { fontSize: 12, fontWeight: '700' },

  serviceName: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 2 },
  extrasText: { fontSize: 12, color: '#8B949E', marginBottom: 10 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  customerName: { fontSize: 12, color: '#8B949E', marginBottom: 2 },
  timeText: { fontSize: 12, color: '#8B949E' },
  price: { fontSize: 20, fontWeight: '900', color: '#fff' },

  actionBtn: { marginTop: 12, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#8B949E', textAlign: 'center' },
});