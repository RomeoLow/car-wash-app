import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Initial service data
const INITIAL_SERVICES = [
  { id: '1', name: 'Basic Wash', price: '15' },
  { id: '2', name: 'Water Wax', price: '45' },
  { id: '3', name: 'Premium Polish', price: '120' },
  { id: '4', name: 'Interior Cleaning', price: '35' },
];

export default function ServiceSettingsScreen({ navigation }: any) {
  const [services, setServices] = useState(INITIAL_SERVICES);

  const handleUpdatePrice = (id: string, newPrice: string) => {
    const updated = services.map(s => s.id === id ? { ...s, price: newPrice } : s);
    setServices(updated);
  };

  const saveSettings = () => {
    // Here you can call Firebase to update the database in the future
    Alert.alert('Success', 'Service prices updated successfully!');
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Service Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Manage Service Pricing</Text>
        
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.infoColumn}>
              <Text style={service.name === 'Water Wax' ? styles.highlightName : styles.serviceName}>
                {service.name}
              </Text>
              <Text style={styles.currencyHint}>Set price in RM</Text>
            </View>
            
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencyPrefix}>RM</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={service.price}
                onChangeText={(text) => handleUpdatePrice(service.id, text)}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: 'bold', marginRight: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  
  scrollContainer: { padding: 20 },
  sectionTitle: { fontSize: 16, color: '#666', marginBottom: 15, fontWeight: '600' },

  // Service card styles
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  infoColumn: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#333' },
  highlightName: { fontSize: 16, fontWeight: 'bold', color: '#673AB7' }, // Highlight a specific service
  currencyHint: { fontSize: 12, color: '#AAA', marginTop: 2 },

  // Input field styles
  priceInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: 100,
  },
  currencyPrefix: { color: '#555', fontWeight: 'bold', marginRight: 4 },
  priceInput: { 
    flex: 1, 
    height: 40, 
    fontWeight: 'bold', 
    color: '#333',
    textAlign: 'right'
  },

  // Save button styles
  saveButton: {
    backgroundColor: '#673AB7',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});