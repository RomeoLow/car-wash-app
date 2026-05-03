import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import Firebase services and methods[cite: 12]
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function RevenueReportsScreen({ navigation }: any) {
  const [filter, setFilter] = useState('Daily');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]); // Synced with teammate's booking structure[cite: 12]
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch real revenue data from Firebase[cite: 12]
  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        // Query only bookings where status is 'Done' to calculate revenue[cite: 10, 12]
        const q = query(
          collection(db, 'bookings'), 
          where('status', '==', 'Done')
        );
        
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        const fetchedData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Accumulate total price from each completed job[cite: 12]
          total += (data.totalPrice || 0); 
          
          // Format Firestore Timestamp into a readable date string[cite: 8]
          const date = data.createdAt?.toDate 
            ? data.createdAt.toDate().toLocaleDateString('en-MY') 
            : 'N/A';

          return { 
            id: doc.id, 
            ...data,
            formattedDate: date 
          };
        });

        // Force TypeScript to ignore the type check for these specific properties
        fetchedData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setTotalRevenue(total);
        setTransactions(fetchedData);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  // Helper component for displaying stats cards
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

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* 1. Overview Section - Uses real data from Firebase[cite: 12] */}
        <View style={styles.statsRow}>
          {renderStatCard('Total Revenue', `RM ${totalRevenue.toFixed(2)}`, '#2E7D32')}
          {renderStatCard('Total Jobs', `${transactions.length}`, '#1976D2')}
        </View>

        {/* 2. Filter Tabs */}
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

        {/* 3. Transaction History List */}
        <View style={styles.reportSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed Transactions</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#673AB7" style={{ margin: 20 }} />
          ) : transactions.length === 0 ? (
            <Text style={styles.emptyText}>No completed transactions yet.</Text>
          ) : (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionItem}>
                <View style={styles.iconPlaceholder}>
                  <Text style={styles.iconEmoji}>🚗</Text>
                </View>
                <View style={styles.transactionInfo}>
                  {/* Display service name and plate number as seen in teammate's code */}
                  <Text style={styles.serviceText}>{item.serviceName}</Text>
                  <Text style={styles.plateText}>{item.plate}</Text> 
                  <Text style={styles.dateText}>{item.formattedDate}</Text>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>RM {item.totalPrice}</Text>
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
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, 
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' 
  },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: 'bold', marginRight: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  container: { padding: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '48%', elevation: 4 },
  statLabel: { fontSize: 11, color: '#666', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', backgroundColor: '#E0E0E0', borderRadius: 12, padding: 4, marginBottom: 20 },
  filterTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#fff', elevation: 2 },
  filterText: { color: '#666', fontWeight: '600' },
  activeFilterText: { color: '#673AB7' },
  reportSection: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2 },
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  iconPlaceholder: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconEmoji: { fontSize: 20 },
  transactionInfo: { flex: 1 },
  serviceText: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  // Plate style for consistency with teammate's booking identification
  plateText: { fontSize: 12, color: '#673AB7', fontWeight: '600', marginVertical: 2 }, 
  dateText: { fontSize: 12, color: '#999' },
  amountContainer: { alignItems: 'flex-end' },
  amountText: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  statusText: { fontSize: 11, color: '#4CAF50', fontWeight: '600', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#999', marginVertical: 20 }
});