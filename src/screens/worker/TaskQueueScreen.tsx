import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function TaskQueueScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Jobs</Text>
      <View style={styles.placeholderCard}>
        <Text>Member 3: List car washes currently in progress</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 20 },
  placeholderCard: { padding: 40, backgroundColor: '#f9f9f9', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', alignItems: 'center' }
});