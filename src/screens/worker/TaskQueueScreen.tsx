import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function TaskQueueScreen() {
  const jobs = [
    { id: '1', car: 'Proton Saga (JXX 1234)', service: 'Basic Wash', time: '10:30 AM' },
    { id: '2', car: 'Perodua Myvi (WB 5678)', service: 'Full Wax', time: '11:15 AM' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Worker Job Queue</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <View>
              <Text style={styles.carText}>{item.car}</Text>
              <Text style={styles.serviceText}>{item.service} - {item.time}</Text>
            </View>
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  jobCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
  carText: { fontSize: 16, fontWeight: 'bold' },
  serviceText: { color: '#666' },
  doneButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  doneText: { color: '#fff', fontWeight: 'bold' }
});