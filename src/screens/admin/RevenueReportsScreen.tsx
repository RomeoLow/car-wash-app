import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simulated trading data: In actual development, this can be obtained through the Firebase API.
const MOCK_DATA = [
  { id: '1', date: '2026-04-18', amount: 'RM 50', service: 'Full Wash', status: 'Completed' },
  { id: '2', date: '2026-04-18', amount: 'RM 35', service: 'Interior Cleaning', status: 'Completed' },
  { id: '3', date: '2026-04-17', amount: 'RM 120', service: 'Premium Waxing', status: 'Completed' },
  { id: '4', date: '2026-04-17', amount: 'RM 45', service: 'Body Wash', status: 'Completed' },
  { id: '5', date: '2026-04-16', amount: 'RM 80', service: 'Engine Cleaning', status: 'Completed' },
];

export default function RevenueReportsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('Daily');

  // Render statistic card component
  const renderStatCard = (label: string, value: string, color: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Revenue Reports</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Overview Data Area */}
        <View style={styles.statsRow}>
          {renderStatCard('Total Revenue', 'RM 2,450', '#2E7D32')}
          {renderStatCard('Total Jobs', '48', '#1976D2')}
        </View>

        {/* 2. Filter (Toggle Tabs) */}
        <View style={styles.filterContainer}>
          {['Daily', 'Weekly', 'Monthly'].map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.filterTab, filter === item && styles.activeTab]}
              onPress={() => setFilter(item)}
              activeOpacity={0.9}
            >
              <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Detailed Transaction List */}
        <View style={styles.reportSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {MOCK_DATA.map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconEmoji}>🚗</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.serviceText}>{item.service}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>{item.amount}</Text>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: { 
    color: '#673AB7', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginRight: 20 
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  container: { 
    padding: 16 
  },
  
  // Statistic Card Styles
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  statCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 16, 
    width: '48%', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statLabel: { 
    fontSize: 12, 
    color: '#666', 
    marginBottom: 8, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: 'bold' 
  },

  // Filter Styles
  filterContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#E0E0E0', 
    borderRadius: 12, 
    padding: 4, 
    marginBottom: 20 
  },
  filterTab: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 10 
  },
  activeTab: { 
    backgroundColor: '#fff',
    elevation: 2,
  },
  filterText: { 
    color: '#666', 
    fontWeight: '600' 
  },
  activeFilterText: { 
    color: '#673AB7' 
  },

  // Transaction list style
  reportSection: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  viewAllText: {
    color: '#673AB7',
    fontSize: 13,
    fontWeight: '600'
  },
  transactionItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA'
  },
  iconPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  iconEmoji: {
    fontSize: 20
  },
  transactionInfo: {
    flex: 1
  },
  serviceText: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 4
  },
  dateText: { 
    fontSize: 12, 
    color: '#999' 
  },
  amountContainer: {
    alignItems: 'flex-end'
  },
  amountText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2E7D32' 
  },
  statusText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 2
  }
});