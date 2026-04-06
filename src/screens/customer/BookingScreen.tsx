import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function BookingScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Booking</Text>
      <View style={styles.placeholderCard}>
        <Text>Member 2: Add Plate Number & Service Picker here</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  placeholderCard: { padding: 40, backgroundColor: '#fff', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', alignItems: 'center' }
});