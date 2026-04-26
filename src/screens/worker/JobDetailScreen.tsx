// src/screens/worker/JobDetailScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const SIZE_LABELS: Record<string, string> = {
  S: 'Mini',  M: 'Sedan',  L: 'SUV',  XL: 'MPV',  XXL: 'Van',
};

const STATUS_CONFIG = {
  Pending: { color: '#F59E0B', bg: '#2A1F0A', icon: '⏳' },
  Washing: { color: '#5B8DEF', bg: '#0A1525', icon: '🚿' },
  Done:    { color: '#34D399', bg: '#0A2018', icon: '✅' },
};

export default function JobDetailScreen({ navigation, route }: any) {
  const job = route?.params?.job;
  const [updating, setUpdating] = useState(false);

  if (!job) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <Text style={s.errorText}>Job not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={s.backLink}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const cfg = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.Pending;
  const sizeLabel = SIZE_LABELS[job.size] ?? job.size;

  const handleStatusChange = async (next: 'Washing' | 'Done') => {
    const label = next === 'Washing' ? 'Start Washing' : 'Mark as Done';
    Alert.alert(label, `Set this job to "${next}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setUpdating(true);
          try {
            await updateDoc(doc(db, 'bookings', job.id), { status: next });
            navigation.goBack();
          } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to update status. Try again.');
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Job Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>

        {/* Plate hero */}
        <View style={s.heroCard}>
          <Text style={s.plateHero}>{job.plate}</Text>
          <View style={s.heroMeta}>
            <View style={s.sizeChip}>
              <Text style={s.sizeChipText}>{job.size} · {sizeLabel}</Text>
            </View>
            <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
              <Text style={s.statusIcon}>{cfg.icon}</Text>
              <Text style={[s.statusText, { color: cfg.color }]}>{job.status}</Text>
            </View>
          </View>
        </View>

        {/* Customer */}
        <Text style={s.sectionLabel}>Customer</Text>
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>👤</Text>
            <Text style={s.infoValue}>{job.customerName || 'Customer'}</Text>
          </View>
        </View>

        {/* Services */}
        <Text style={s.sectionLabel}>Services to Perform</Text>
        <View style={s.infoCard}>
          <View style={s.serviceRow}>
            <Text style={s.serviceIcon}>🔧</Text>
            <Text style={s.serviceMain}>{job.serviceName}</Text>
          </View>
          {job.extras && job.extras.length > 0 && (
            <>
              <View style={s.divider} />
              {job.extras.map((ex: string, i: number) => (
                <View key={i} style={s.serviceRow}>
                  <Text style={s.serviceIcon}>➕</Text>
                  <Text style={s.serviceExtra}>{ex}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Price */}
        <Text style={s.sectionLabel}>Total</Text>
        <View style={s.priceCard}>
          <Text style={s.priceLabel}>Amount to collect</Text>
          <Text style={s.priceValue}>RM {job.totalPrice}</Text>
        </View>

        {/* Action Buttons */}
        <View style={s.actionsSection}>
          {job.status === 'Pending' && (
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: '#5B8DEF' }]}
              onPress={() => handleStatusChange('Washing')}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.actionBtnText}>🚿  Start Washing</Text>
              )}
            </TouchableOpacity>
          )}
          {job.status === 'Washing' && (
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: '#34D399' }]}
              onPress={() => handleStatusChange('Done')}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.actionBtnText}>✅  Mark as Done</Text>
              )}
            </TouchableOpacity>
          )}
          {job.status === 'Done' && (
            <View style={[s.actionBtn, { backgroundColor: '#0A2018' }]}>
              <Text style={[s.actionBtnText, { color: '#34D399' }]}>✅  Job Completed</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1117' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#161B22', borderBottomWidth: 1, borderBottomColor: '#21262D',
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#21262D', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { color: '#34D399', fontSize: 18, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },

  scroll: { padding: 16, paddingBottom: 60 },

  heroCard: {
    backgroundColor: '#161B22', borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 24,
    borderWidth: 1, borderColor: '#21262D',
  },
  plateHero: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: 3, marginBottom: 14 },
  heroMeta: { flexDirection: 'row', gap: 10 },
  sizeChip: { backgroundColor: '#21262D', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  sizeChipText: { color: '#8B949E', fontSize: 13, fontWeight: '700' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  statusIcon: { fontSize: 13 },
  statusText: { fontSize: 13, fontWeight: '700' },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#8B949E', letterSpacing: 1,
    textTransform: 'uppercase', marginBottom: 8, marginTop: 4,
  },

  infoCard: {
    backgroundColor: '#161B22', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#21262D', marginBottom: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  infoIcon: { fontSize: 18 },
  infoValue: { fontSize: 15, color: '#fff', fontWeight: '600' },

  serviceRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  serviceIcon: { fontSize: 16 },
  serviceMain: { fontSize: 16, fontWeight: '700', color: '#fff', flex: 1 },
  serviceExtra: { fontSize: 14, fontWeight: '600', color: '#8B949E', flex: 1 },
  divider: { height: 1, backgroundColor: '#21262D', marginHorizontal: 14 },

  priceCard: {
    backgroundColor: '#161B22', borderRadius: 16, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#21262D', marginBottom: 24,
  },
  priceLabel: { fontSize: 13, color: '#8B949E', fontWeight: '600' },
  priceValue: { fontSize: 28, fontWeight: '900', color: '#fff' },

  actionsSection: { gap: 10 },
  actionBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorText: { color: '#8B949E', fontSize: 16, marginBottom: 16 },
  backLink: { color: '#34D399', fontWeight: '700', fontSize: 15 },
});