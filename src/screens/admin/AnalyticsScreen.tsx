import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function AnalyticsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    popularService: 'N/A',
    avgTicket: 0,
    peakDay: 'N/A'
  });

  useEffect(() => {
    const q = query(collection(db, 'bookings'), where('status', '==', 'Done'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      
      if (data.length > 0) {
        // 1. Calculate average ticket price
        const totalRevenue = data.reduce((s, i) => s + (i.totalPrice || 0), 0);
        const avg = totalRevenue / data.length;

        // 2. Find most popular service
        const serviceCounts: any = {};
        data.forEach(item => {
          serviceCounts[item.serviceName] = (serviceCounts[item.serviceName] || 0) + 1;
        });
        const popular = Object.keys(serviceCounts).reduce((a, b) => serviceCounts[a] > serviceCounts[b] ? a : b);

        // 3. Find busiest day of the week
        const dayCounts: any = {};
        data.forEach(item => {
          if (item.createdAt) {
            const day = new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-US', { weekday: 'long' });
            dayCounts[day] = (dayCounts[day] || 0) + 1;
          }
        });
        const busiest = Object.keys(dayCounts).length > 0 
          ? Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b)
          : 'N/A';

        setStats({
          totalJobs: data.length,
          popularService: popular,
          avgTicket: avg,
          peakDay: busiest
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Business Analytics</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator color="#673AB7" style={{ marginTop: 50 }} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            
            {/* Quick Stats Grid */}
            <View style={styles.grid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Jobs</Text>
                <Text style={styles.statValue}>{stats.totalJobs}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Avg. Ticket</Text>
                <Text style={styles.statValue}>RM {stats.avgTicket.toFixed(0)}</Text>
              </View>
            </View>

            {/* Service Insights */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Top Performing Service</Text>
              <View style={styles.highlightRow}>
                <View style={styles.iconCircle}><Text style={{fontSize: 20}}>🏆</Text></View>
                <View>
                  <Text style={styles.highlightText}>{stats.popularService}</Text>
                  <Text style={styles.subText}>Most requested by customers</Text>
                </View>
              </View>
            </View>

            {/* Time Insights */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Busiest Day</Text>
              <View style={styles.highlightRow}>
                <View style={[styles.iconCircle, {backgroundColor: '#FFF7ED'}]}><Text style={{fontSize: 20}}>📅</Text></View>
                <View>
                  <Text style={[styles.highlightText, {color: '#EA580C'}]}>{stats.peakDay}</Text>
                  <Text style={styles.subText}>Highest traffic recorded</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  backBtn: { color: '#673AB7', fontWeight: 'bold', marginRight: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  container: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  statLabel: { fontSize: 12, color: '#666' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#673AB7', marginTop: 5 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  highlightText: { fontSize: 18, fontWeight: 'bold', color: '#673AB7' },
  subText: { fontSize: 12, color: '#999' }
});