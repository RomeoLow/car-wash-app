import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Firestore imports
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Define the structure for a transaction object
interface Transaction {
  id: string;
  serviceName: string;
  plate: string;
  totalPrice: number;
  status: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function RevenueReportsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('Daily'); // Current active filter (Daily, Weekly, Monthly)
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // Raw data from Firestore

  // Real-time listener for bookings with status 'Done'
  useEffect(() => {
    const q = query(
      collection(db, 'bookings'), 
      where('status', '==', 'Done')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];

      // Sort by timestamp: newest transactions first
      fetchedData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setAllTransactions(fetchedData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching revenue data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter logic: Calculates totals and filtered lists based on the selected state
  const getFilteredData = () => {
    const now = new Date();
    
    const filteredList = allTransactions.filter(item => {
      if (!item.createdAt) return false;
      
      // Convert Firestore timestamp to JS Date object
      const itemDate = new Date(item.createdAt.seconds * 1000);

      if (filter === 'Daily') {
        // Match exact calendar day (Today)
        return itemDate.toDateString() === now.toDateString();
      } 
      
      if (filter === 'Weekly') {
        // Match transactions within the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return itemDate >= sevenDaysAgo;
      }
      
      if (filter === 'Monthly') {
        // Match transactions within the last 30 days (Rolling Month)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return itemDate >= thirtyDaysAgo;
      }
      
      return true;
    });

    // Calculate total revenue for the filtered list
    const totalRevenue = filteredList.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    return {
      list: filteredList,
      totalRevenue,
      totalJobs: filteredList.length
    };
  };

  // Extract calculated data based on active filter
  const { list, totalRevenue, totalJobs } = getFilteredData();

  // Reusable component for statistic summary cards
  const renderStatCard = (label: string, value: string, color: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Revenue Reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Statistics Overview */}
        <View style={styles.statsRow}>
          {renderStatCard('Total Revenue', `RM ${totalRevenue.toFixed(2)}`, '#2E7D32')}
          {renderStatCard('Total Jobs', `${totalJobs}`, '#1976D2')}
        </View>

        {/* Period Filters */}
        <View style={styles.filterContainer}>
          {['Daily', 'Weekly', 'Monthly'].map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.filterTab, filter === item && styles.activeTab]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Detailed List of Transactions */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Completed Transactions</Text>

          {loading ? (
            <ActivityIndicator color="#673AB7" style={{ margin: 20 }} />
          ) : list.length === 0 ? (
            <Text style={styles.emptyText}>No transactions found for this period.</Text>
          ) : (
            list.map((item) => (
              <View key={item.id} style={styles.transactionItem}>
                <View style={styles.iconPlaceholder}>
                  <Text style={{ fontSize: 20 }}>🚗</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.serviceText}>{item.serviceName}</Text>
                  <Text style={styles.plateText}>{item.plate}</Text> 
                  <Text style={styles.dateText}>
                    {/* Format example: 27/4/2026 (Mon) */}
                    {new Date(item.createdAt!.seconds * 1000).toLocaleDateString('en-MY', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      weekday: 'short', // Shows Mon, Tue, etc.
                    })}
                  </Text>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>RM {item.totalPrice.toFixed(2)}</Text>
                  <Text style={styles.statusText}>Done</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', alignItems: 'center', padding: 20, 
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' 
  },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: 'bold', marginRight: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  container: { padding: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '48%', elevation: 3 },
  statLabel: { fontSize: 12, color: '#666', marginBottom: 5, fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', backgroundColor: '#E0E0E0', borderRadius: 12, padding: 4, marginBottom: 20 },
  filterTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#fff', elevation: 2 },
  filterText: { color: '#666', fontWeight: '600' },
  activeFilterText: { color: '#673AB7' },
  reportSection: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2, minHeight: 300 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  iconPlaceholder: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transactionInfo: { flex: 1 },
  serviceText: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  plateText: { fontSize: 12, color: '#673AB7', fontWeight: '600', marginVertical: 2 }, 
  dateText: { fontSize: 11, color: '#999' },
  amountContainer: { alignItems: 'flex-end' },
  amountText: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  statusText: { fontSize: 11, color: '#4CAF50', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 }
});