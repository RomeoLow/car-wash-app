import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Imports[cite: 13, 14]
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

interface Service {
  id: string;
  name: string;
  price: string;
}

export default function ServiceSettingsScreen({ navigation }: any) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial services from Firestore[cite: 13]
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const serviceList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price.toString()
        }));
        setServices(serviceList);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleUpdatePrice = (id: string, newPrice: string) => {
    const updated = services.map(s => s.id === id ? { ...s, price: newPrice } : s);
    setServices(updated);
  };

  // Improved saveSettings with Firestore integration[cite: 14]
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Loop through and update each service document in Firestore[cite: 14]
      for (const service of services) {
        await setDoc(doc(db, 'services', service.id), {
          name: service.name,
          price: Number(service.price) // Ensure it is saved as a number[cite: 14]
        }, { merge: true }); // Use merge to avoid overwriting other fields[cite: 14]
      }
      Alert.alert('Success', 'Service prices updated successfully!');
    } catch (error) {
      console.error("Error updating prices: ", error);
      Alert.alert('Error', 'Could not save prices.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#673AB7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Service Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Manage Service Pricing</Text>
        
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.infoColumn}>
              <Text style={service.name.includes('Wax') ? styles.highlightName : styles.serviceName}>
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

        <TouchableOpacity 
          style={[styles.saveButton, isSaving && { opacity: 0.7 }]} 
          onPress={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: 'bold', marginRight: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scrollContainer: { padding: 20 },
  sectionTitle: { fontSize: 14, color: '#999', marginBottom: 15, fontWeight: '700', textTransform: 'uppercase' },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  infoColumn: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#333' },
  highlightName: { fontSize: 16, fontWeight: 'bold', color: '#673AB7' },
  currencyHint: { fontSize: 11, color: '#AAA', marginTop: 4 },
  priceInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    width: 110,
  },
  currencyPrefix: { color: '#6B7280', fontWeight: 'bold', marginRight: 4 },
  priceInput: { flex: 1, height: 45, fontWeight: 'bold', color: '#333', textAlign: 'right' },
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