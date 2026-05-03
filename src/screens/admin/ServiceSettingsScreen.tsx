// src/screens/admin/ServiceSettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ── Default pricing (used if Firestore doc doesn't exist yet) ──
export const DEFAULT_PRICING = {
  services: [
    { id: '1', icon: '🚿', name: 'Normal Wash',                 basePrice: 12, color: '#5B8DEF' },
    { id: '2', icon: '✨', name: 'Water Wax',                   basePrice: 25, color: '#A78BFA' },
    { id: '3', icon: '🌫️', name: 'Water Wax & Fogging Package', basePrice: 45, color: '#34D399' },
    { id: '4', icon: '🪣', name: 'Wax',                         basePrice: 120, color: '#FB923C' },
    { id: '5', icon: '💎', name: 'Polish',                       basePrice: 300, color: '#F472B6' },
  ],
  sizeIncrements: { S: 0, M: 3, L: 6, XL: 8, XXL: 18 },
  extras: [
    { id: 'e1', name: 'Interior Wax', price: 50 },
    { id: 'e2', name: 'Wash Engine',  price: 25 },
    { id: 'e3', name: 'Fogging',      price: 25 },
  ],
};

type Pricing = typeof DEFAULT_PRICING;
const SIZE_LABELS: Record<string, string> = {
  S: 'Mini (S)', M: 'Sedan (M)', L: 'SUV (L)', XL: 'MPV (XL)', XXL: 'Van (XXL)',
};

export default function ServiceSettingsScreen({ navigation }: any) {
  const [pricing, setPricing] = useState<Pricing>(DEFAULT_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'pricing'));
      if (snap.exists()) {
        setPricing(snap.data() as Pricing);
      } else {
        await setDoc(doc(db, 'settings', 'pricing'), DEFAULT_PRICING);
      }
    } catch {
      Alert.alert('Error', 'Could not load pricing.');
    } finally {
      setLoading(false);
    }
  };

  const savePricing = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'pricing'), pricing);
      Alert.alert('✅ Saved', 'Pricing updated successfully!');
    } catch {
      Alert.alert('Error', 'Could not save pricing.');
    } finally {
      setSaving(false);
    }
  };

  const updateServicePrice = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setPricing(prev => ({
      ...prev,
      services: prev.services.map(sv => sv.id === id ? { ...sv, basePrice: num } : sv),
    }));
  };

  const updateSizeIncrement = (key: string, value: string) => {
    const num = parseInt(value) || 0;
    setPricing(prev => ({
      ...prev,
      sizeIncrements: { ...prev.sizeIncrements, [key]: num },
    }));
  };

  const updateExtraPrice = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setPricing(prev => ({
      ...prev,
      extras: prev.extras.map(ex => ex.id === id ? { ...ex, price: num } : ex),
    }));
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color="#673AB7" size="large" />
        <Text style={s.loadingText}>Loading pricing...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={s.title}>Service Settings</Text>
        <TouchableOpacity onPress={savePricing} style={s.saveBtn} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={s.saveBtnText}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>

        {/* How it works */}
        <View style={s.infoBox}>
          <Text style={s.infoTitle}>💡 How Pricing Works</Text>
          <Text style={s.infoText}>
            Set a <Text style={s.bold}>base price</Text> for each service (S size).{'\n'}
            Each larger size adds an <Text style={s.bold}>increment</Text> on top.{'\n'}
            Example: Normal Wash S = RM12, M = RM12 + RM3 = <Text style={s.bold}>RM15</Text>
          </Text>
        </View>

        {/* ── Service Base Prices ── */}
        <Text style={s.sectionTitle}>Service Base Prices (S size)</Text>
        {pricing.services.map(sv => (
          <View key={sv.id} style={[s.card, { borderLeftColor: sv.color }]}>
            <Text style={s.cardIcon}>{sv.icon}</Text>
            <Text style={s.cardName}>{sv.name}</Text>
            <View style={s.inputWrap}>
              <Text style={s.prefix}>RM</Text>
              <TextInput
                style={s.input}
                keyboardType="numeric"
                value={String(sv.basePrice)}
                onChangeText={v => updateServicePrice(sv.id, v)}
                selectTextOnFocus
              />
            </View>
          </View>
        ))}

        {/* ── Size Increments ── */}
        <Text style={s.sectionTitle}>Size Increments (+RM per size)</Text>
        <Text style={s.hint}>S is always +0 (base). Set how much to add for each larger size.</Text>
        {Object.entries(pricing.sizeIncrements).map(([key, val]) => (
          <View key={key} style={s.card}>
            <View style={s.sizeBadge}>
              <Text style={s.sizeBadgeText}>{key}</Text>
            </View>
            <Text style={s.cardName}>{SIZE_LABELS[key]}</Text>
            <View style={s.inputWrap}>
              <Text style={s.prefix}>+RM</Text>
              <TextInput
                style={[s.input, key === 'S' && s.disabledInput]}
                keyboardType="numeric"
                value={String(val)}
                onChangeText={v => updateSizeIncrement(key, v)}
                editable={key !== 'S'}
                selectTextOnFocus
              />
            </View>
          </View>
        ))}

        {/* ── Extras ── */}
        <Text style={s.sectionTitle}>Extra Service Prices</Text>
        {pricing.extras.map(ex => (
          <View key={ex.id} style={s.card}>
            <Text style={s.cardName}>{ex.name}</Text>
            <View style={s.inputWrap}>
              <Text style={s.prefix}>+RM</Text>
              <TextInput
                style={s.input}
                keyboardType="numeric"
                value={String(ex.price)}
                onChangeText={v => updateExtraPrice(ex.id, v)}
                selectTextOnFocus
              />
            </View>
          </View>
        ))}

        {/* ── Price Preview ── */}
        <Text style={s.sectionTitle}>Price Preview</Text>
        <View style={s.previewBox}>
          {pricing.services.map(sv => (
            <View key={sv.id} style={s.previewRow}>
              <Text style={[s.previewName, { color: sv.color }]}>{sv.icon} {sv.name}</Text>
              <View style={s.previewPrices}>
                {Object.entries(pricing.sizeIncrements).map(([key, inc]) => (
                  <Text key={key} style={s.previewItem}>
                    {key}: <Text style={s.previewAmt}>
                      {sv.id === '4' && key === 'XXL' ? 'N/A' : `RM${sv.basePrice + inc}`}
                    </Text>
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.bigSave} onPress={savePricing} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.bigSaveText}>💾 Save All Changes</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 12 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, backgroundColor: '#fff', elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  saveBtn: { backgroundColor: '#673AB7', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  scroll: { padding: 20, paddingBottom: 60 },

  infoBox: {
    backgroundColor: '#F5F3FF', borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: '#D1C4E9',
  },
  infoTitle: { color: '#4527A0', fontWeight: '700', fontSize: 13, marginBottom: 6 },
  infoText: { color: '#555', fontSize: 12, lineHeight: 18 },
  bold: { color: '#673AB7', fontWeight: '700' },

  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#888',
    letterSpacing: 1, textTransform: 'uppercase', marginTop: 24, marginBottom: 10,
  },
  hint: { fontSize: 12, color: '#AAA', marginBottom: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#EEE', borderLeftWidth: 4, borderLeftColor: '#DDD',
    elevation: 1, gap: 10,
  },
  cardIcon: { fontSize: 18 },
  cardName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#333' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F2F5', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, gap: 4,
  },
  prefix: { fontSize: 12, color: '#888', fontWeight: '600' },
  input: { fontSize: 15, fontWeight: '800', color: '#333', minWidth: 44, textAlign: 'right' },
  disabledInput: { color: '#BBB' },

  sizeBadge: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center',
  },
  sizeBadgeText: { fontSize: 12, fontWeight: '800', color: '#673AB7' },

  previewBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#EEE', gap: 14,
  },
  previewRow: { gap: 6 },
  previewName: { fontSize: 13, fontWeight: '700' },
  previewPrices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  previewItem: { fontSize: 11, color: '#888' },
  previewAmt: { color: '#333', fontWeight: '700' },

  bigSave: {
    marginTop: 24, backgroundColor: '#673AB7',
    borderRadius: 14, padding: 16, alignItems: 'center',
  },
  bigSaveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});