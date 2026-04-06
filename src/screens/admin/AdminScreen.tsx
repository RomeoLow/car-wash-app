import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function AdminScreen() {
  const activeOrders = [
    { id: '1', car: 'Proton Saga', status: 'In Progress' },
    { id: '2', car: 'Honda Civic', status: 'Waiting' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <Text style={styles.subHeader}>Team C: Management Section</Text>

      <FlatList
        data={activeOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.carName}>{item.car}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#ff9800' },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },
  orderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' },
  carName: { fontSize: 16 },
  status: { color: '#ff9800', fontWeight: '600' },
});