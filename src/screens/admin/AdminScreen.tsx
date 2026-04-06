import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Business Insights</Text>
      <View style={styles.placeholderCard}>
        <Text>Member 3: Add daily revenue & staff management here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#FF9800', marginBottom: 20 },
  placeholderCard: { padding: 40, backgroundColor: '#fff8f0', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', alignItems: 'center' }
});