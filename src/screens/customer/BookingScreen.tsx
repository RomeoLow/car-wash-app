// screens/BookingScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView
} from 'react-native';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const SERVICES = [
  { id: '1', icon: '🚿', name: 'Normal Wash', prices: { S: 12, M: 15, L: 18, XL: 20, XXL: 30 }, color: '#5B8DEF' },
  { id: '2', icon: '✨', name: 'Water Wax', prices: { S: 25, M: 30, L: 35, XL: 40, XXL: 60 }, color: '#A78BFA' },
  { id: '3', icon: '🌫️', name: 'Water Wax & Fogging Package', prices: { S: 45, M: 50, L: 60, XL: 70, XXL: 80 }, color: '#34D399' },
  { id: '4', icon: '🪣', name: 'Wax', prices: { S: 120, M: 150, L: 200, XL: 250, XXL: null }, color: '#FB923C' },
  { id: '5', icon: '💎', name: 'Polish', prices: { S: 300, M: 350, L: 400, XL: 450, XXL: 600 }, color: '#F472B6' },
];

const EXTRAS = [
  { id: 'e1', name: 'Interior Wax', prices: { S: 50, M: 50, L: 50, XL: 80, XXL: 80 } },
  { id: 'e2', name: 'Wash Engine', prices: { S: 25, M: 25, L: 25, XL: 25, XXL: 30 } },
  { id: 'e3', name: 'Fogging', prices: { S: 25, M: 25, L: 25, XL: 25, XXL: 30 } },
];

type BookingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function BookingScreen({ navigation }: BookingScreenProps) {
  const [plate, setPlate] = useState('');
  const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL' | null>(null);
  const [service, setService] = useState<typeof SERVICES[number] | null>(null);
  const [extras, setExtras] = useState<string[]>([]);

  const handleLogout = () => signOut(auth);

  // Added string type to id to fix TypeScript warning
  const toggleExtra = (id: string) =>
    setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const basePrice = service && size ? (service.prices[size] ?? null) : null;
  const extraTotal = size ? extras.reduce((sum, id) => {
    const ex = EXTRAS.find(e => e.id === id);
    return sum + (ex?.prices[size] ?? 0);
  }, 0) : 0;
  const total = basePrice != null ? basePrice + extraTotal : null;

  const ready = plate.trim().length > 0 && size && service && basePrice != null;

  return (
    <SafeAreaView style={s.safe}>
      {/* Wrapped in KeyboardAvoidingView to prevent keyboard from covering the button */}
      <KeyboardAvoidingView 
        style={s.safe} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.appTitle}>My Car Wash</Text>
          <TouchableOpacity onPress={handleLogout} style={s.logoutBtn}>
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* ── Welcome Banner ── */}
        <View style={s.banner}>
          <Text style={s.welcome}>Hello, {auth.currentUser?.displayName || 'Customer'}!</Text>
          <Text style={s.subtitle}>Keep your car shining today.</Text>
        </View>

        {/* ── Booking Form ── */}
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.pageTitle}>New Booking</Text>

          {/* Plate */}
          <Text style={s.label}>Car Plate Number</Text>
          <View style={s.inputRow}>
            <Text style={s.inputIcon}>🚗</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. JHF 1234"
              placeholderTextColor="#5A5A78"
              autoCapitalize="characters"
              maxLength={10}
              value={plate}
              // Automatically formats to uppercase
              onChangeText={(text) => setPlate(text.toUpperCase())}
            />
          </View>

          {/* Car Size */}
          <Text style={s.label}>Car Size</Text>
          <View style={s.sizeRow}>
            {SIZES.map(sz => (
              <TouchableOpacity
                key={sz}
                style={[s.sizeBtn, size === sz && s.sizeBtnActive]}
                // Clears selections so a user can't accidentally keep a null-priced service
                onPress={() => { setSize(sz as any); setService(null); setExtras([]); }}
              >
                <Text style={[s.sizeTxt, size === sz && s.sizeTxtActive]}>{sz}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Services */}
          <Text style={s.label}>Select Service</Text>
          {SERVICES.map(sv => {
            const price = size ? sv.prices[size as keyof typeof sv.prices] : null;
            const unavailable = size && price === null;
            return (
              <TouchableOpacity
                key={sv.id}
                style={[s.card, { borderLeftColor: sv.color }, service?.id === sv.id && s.cardActive, unavailable && s.cardDim]}
                onPress={() => !unavailable && setService(sv)}
                activeOpacity={unavailable ? 1 : 0.8}
              >
                <Text style={s.cardIcon}>{sv.icon}</Text>
                <Text style={[s.cardName, unavailable && s.dimText]}>{sv.name}</Text>
                <Text style={[s.cardPrice, unavailable && s.dimText]}>
                  {unavailable ? 'N/A' : size ? `RM ${price}` : '—'}
                </Text>
                {service?.id === sv.id && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}

          {/* Extra Services */}
          {size && (
            <>
              <Text style={s.label}>Extra Services</Text>
              {EXTRAS.map(ex => {
                const price = ex.prices[size as keyof typeof ex.prices];
                const unavailable = price === null;
                const active = extras.includes(ex.id);
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[s.extraRow, active && s.extraActive, unavailable && s.cardDim]}
                    onPress={() => !unavailable && toggleExtra(ex.id)}
                    activeOpacity={unavailable ? 1 : 0.8}
                  >
                    <Text style={[s.extraName, unavailable && s.dimText]}>{ex.name}</Text>
                    <Text style={[s.extraPrice, unavailable && s.dimText]}>
                      {unavailable ? 'N/A' : `+RM ${price}`}
                    </Text>
                    {active && <Text style={s.check}> ✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </>
          )}

        </ScrollView>

        {/* ── Bottom Bar ── */}
        <View style={s.bottom}>
          <View style={s.summary}>
            <Text style={s.summaryLabel}>
              {service ? `${service.name} · ${size}` : 'No service selected'}
            </Text>
            <Text style={s.summaryPrice}>
              {total != null ? `RM ${total}` : '—'}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.btn, !ready && s.btnOff]}
            disabled={!ready}
            onPress={() => {
              if (service) { // Added null check for safety
                navigation.navigate('HistoryScreen', { 
                  plate: plate.trim(), 
                  size, 
                  serviceName: service.name, 
                  total 
                });
              }
            }}
          >
            <Text style={s.btnText}>{ready ? 'Confirm Booking →' : 'Fill in details'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, backgroundColor: '#1C1C2E' },
  appTitle: { fontSize: 20, fontWeight: 'bold', color: '#5B8DEF' },
  logoutBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#2E1A1A' },
  logoutText: { color: '#F87171', fontWeight: 'bold', fontSize: 13 },
  banner: { paddingVertical: 18, paddingHorizontal: 20, backgroundColor: '#5B8DEF' },
  welcome: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 13, color: '#D1E4FF', marginTop: 3 },

  pageTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  scroll: { padding: 20, paddingBottom: 180 },
  label: { fontSize: 11, fontWeight: '700', color: '#9090A8', letterSpacing: 1, textTransform: 'uppercase', marginTop: 24, marginBottom: 10 },

  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C2E', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#2E2E4E', gap: 12 },
  inputIcon: { fontSize: 20 },
  input: { flex: 1, fontSize: 18, fontWeight: '700', color: '#fff', letterSpacing: 2 },

  sizeRow: { flexDirection: 'row', gap: 10 },
  sizeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#1C1C2E', borderWidth: 1, borderColor: '#2E2E4E', alignItems: 'center' },
  sizeBtnActive: { backgroundColor: '#5B8DEF', borderColor: '#5B8DEF' },
  sizeTxt: { fontSize: 14, fontWeight: '700', color: '#9090A8' },
  sizeTxtActive: { color: '#fff' },

  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C2E', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2E2E4E', borderLeftWidth: 4, gap: 12 },
  cardActive: { borderColor: '#5B8DEF', backgroundColor: '#1A1A35' },
  cardDim: { opacity: 0.35 },
  cardIcon: { fontSize: 22 },
  cardName: { flex: 1, fontSize: 15, fontWeight: '700', color: '#fff' },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#fff' },
  dimText: { color: '#5A5A78' },
  check: { fontSize: 14, color: '#34D399', fontWeight: '700' },

  extraRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C2E', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#2E2E4E' },
  extraActive: { borderColor: '#34D399', backgroundColor: '#0D2018' },
  extraName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#fff' },
  extraPrice: { fontSize: 14, fontWeight: '700', color: '#9090A8' },

  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0F0F1A', borderTopWidth: 1, borderTopColor: '#1C1C2E', padding: 20, paddingBottom: 32 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: '#9090A8', fontWeight: '600' },
  summaryPrice: { fontSize: 20, fontWeight: '800', color: '#fff' },
  btn: { backgroundColor: '#5B8DEF', borderRadius: 14, padding: 16, alignItems: 'center' },
  btnOff: { backgroundColor: '#1C1C2E' },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});