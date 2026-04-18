import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simulated data: Obtained via API in actual development
const MOCK_DATA = [
  { id: '1', date: '2026-04-18', amount: 'RM 50', service: 'Full Wash', status: 'Completed' },
  { id: '2', date: '2026-04-18', amount: 'RM 35', service: 'Interior Cleaning', status: 'Completed' },
  { id: '3', date: '2026-04-17', amount: 'RM 120', service: 'Premium Waxing', status: 'Completed' },
];

export default function RevenueReportsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('Daily');

  // Render statistic cards
  const renderStatCard = (label: string, value: string, color: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Revenue Reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* 1. Overview area */}
        <View style={styles.statsRow}>
          {renderStatCard('Total Revenue', 'RM 2,450', '#2E7D32')}
          {renderStatCard('Total Jobs', '48', '#1976D2')}
        </View>

        {/* 2. Filter (Tabs) */}
        <View style={styles.filterContainer}>
          {['Daily', 'Weekly', 'Monthly'].map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.filterTab, filter === item && styles.activeTab]}
              onPress={() => setFilter(item)}>
              <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Detailed List */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {MOCK_DATA.map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <View>
                <Text style={styles.serviceText}>{item.service}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <Text style={styles.amountText}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: '600', marginRight: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  container: { padding: 16 },
  
  // Statistic card styles
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    width: '48%', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: { fontSize: 12, color: '#666', marginBottom: 5, fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: 'bold' },

  // Filter styles
  filterContainer: { flexDirection: 'row', backgroundColor: '#E0E0E0', borderRadius: 8, padding: 4, marginBottom: 20 },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#fff' },
  filterText: { color: '#666', fontWeight: '500' },
  activeFilterText: { color: '#673AB7', fontWeight: 'bold' },

  // Detailed list styles
  reportSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  transactionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  serviceText: { fontSize: 14, fontWeight: '600', color: '#333' },
  dateText: { fontSize: 12, color: '#999', marginTop: 2 },
  amountText: { fontSize: 15, fontWeight: 'bold', color: '#2E7D32' }
});