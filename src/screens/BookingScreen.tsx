import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function BookingScreen() {
  const services = ['Basic Wash', 'Premium Wax', 'Interior Detail', 'Engine Cleaning'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Book a Wash</Text>
      <Text style={styles.subHeader}>Team B: Services & Booking Section</Text>

      {services.map((service, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          <Text style={styles.cardText}>{service}</Text>
          <Text style={styles.price}>RM {index * 10 + 15}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
  cardText: { fontSize: 16, fontWeight: '500' },
  price: { color: '#4CAF50', fontWeight: 'bold' },
});