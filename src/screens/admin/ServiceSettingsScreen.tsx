import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Firestore methods
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Define the structure for all types of pricing items
interface PriceItem {
  id: string;
  name: string;
  price: string;
  category: 'sizes' | 'services' | 'extras'; // Used to track which collection it belongs to
}

export default function ServiceSettingsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'sizes' | 'services' | 'extras'>('sizes');
  const [items, setItems] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch data from all three collections on mount
  useEffect(() => {
    const fetchAllPricing = async () => {
      try {
        setLoading(true);
        
        // Fetch Car Sizes
        const sizeSnap = await getDocs(collection(db, 'sizes'));
        const sizes = sizeSnap.docs.map(d => ({
          id: d.id, name: d.data().name, price: d.data().price.toString(), category: 'sizes' as const
        }));

        // Fetch Main Services
        const serviceSnap = await getDocs(collection(db, 'services'));
        const services = serviceSnap.docs.map(d => ({
          id: d.id, name: d.data().name, price: d.data().price.toString(), category: 'services' as const
        }));

        // Fetch Extra Add-ons
        const extraSnap = await getDocs(collection(db, 'extras'));
        const extras = extraSnap.docs.map(d => ({
          id: d.id, name: d.data().name, price: d.data().price.toString(), category: 'extras' as const
        }));

        // Combine all into a single state for easy management
        setItems([...sizes, ...services, ...extras]);
      } catch (error) {
        console.error("Error fetching pricing data:", error);
        Alert.alert("Error", "Could not load pricing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPricing();
  }, []);

  // Handle local state updates for input fields
  const updateLocalPrice = (id: string, newPrice: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, price: newPrice } : item));
  };

  // 2. Save all items back to their respective collections
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const item of items) {
        // Determine target collection based on the category
        let collectionName = '';
        if (item.category === 'sizes') collectionName = 'sizes';
        else if (item.category === 'services') collectionName = 'services';
        else if (item.category === 'extras') collectionName = 'extras';

        const docRef = doc(db, collectionName, item.id);
        await setDoc(docRef, {
          name: item.name,
          price: Number(item.price) // Convert back to number for database
        }, { merge: true });
      }
      Alert.alert("Success", "All pricing categories updated successfully.");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter items to display only for the active tab
  const displayedItems = items.filter(item => item.category === activeTab);

  const renderItemRow = (item: PriceItem) => (
    <View key={item.id} style={styles.priceCard}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.currency}>RM</Text>
        <TextInput
          style={styles.priceInput}
          keyboardType="numeric"
          value={item.price}
          onChangeText={(val) => updateLocalPrice(item.id, val)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Pricing</Text>
      </View>

      {/* Tabs Navigation */}
      <View style={styles.tabBar}>
        {[
          { id: 'sizes', label: 'Car Sizes' },
          { id: 'services', label: 'Services' },
          { id: 'extras', label: 'Extras' }
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {loading ? (
          <ActivityIndicator color="#6366F1" size="large" style={{ marginTop: 40 }} />
        ) : (
          <View>
            <Text style={styles.sectionTitle}>
              Update {activeTab.toUpperCase()} Pricing
            </Text>
            {displayedItems.map(renderItemRow)}
            
            {displayedItems.length === 0 && (
              <Text style={styles.emptyText}>No items found in this category.</Text>
            )}

            <TouchableOpacity 
              style={[styles.saveBtn, isSaving && { opacity: 0.7 }]} 
              onPress={handleSaveAll}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save All Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', alignItems: 'center', padding: 20, 
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' 
  },
  backLink: { color: '#6366F1', fontSize: 16, fontWeight: 'bold', marginRight: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },

  // Tab Bar Styles
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 5, marginBottom: 10 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#6366F1' },
  tabLabel: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13 },
  activeTabLabel: { color: '#6366F1' },

  scrollArea: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748B', marginBottom: 20, letterSpacing: 1 },
  
  priceCard: { 
    flexDirection: 'row', backgroundColor: '#fff', padding: 16, 
    borderRadius: 16, marginBottom: 12, alignItems: 'center',
    justifyContent: 'space-between', elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#334155', flex: 1 },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', 
    borderRadius: 10, paddingHorizontal: 10, width: 100 
  },
  currency: { color: '#64748B', fontWeight: 'bold', marginRight: 5, fontSize: 12 },
  priceInput: { flex: 1, height: 45, fontWeight: 'bold', color: '#1E293B', textAlign: 'right' },

  saveBtn: { 
    backgroundColor: '#6366F1', paddingVertical: 18, borderRadius: 15, 
    alignItems: 'center', marginTop: 30, marginBottom: 50,
    shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 30, fontStyle: 'italic' }
});