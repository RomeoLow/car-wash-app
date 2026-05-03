import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Imports[cite: 15]
import { 
  collection, query, where, onSnapshot, 
  addDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function StaffManagementScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Staff with Real-time Listener[cite: 15]
  useEffect(() => {
    // Filter to only get users with the 'worker' role[cite: 15]
    const q = query(collection(db, 'users'), where('role', '==', 'worker'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staff = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setStaffList(staff);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching staff:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Register New Staff to Firestore[cite: 15]
  const handleRegister = async () => {
    if (!newName || !newRole) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      await addDoc(collection(db, 'users'), {
        displayName: newName,
        role: 'worker', // Base role for navigation control[cite: 6, 15]
        workerRole: newRole, // Specific job title[cite: 15]
        status: 'Off Duty', // Default status for new staff[cite: 15]
        createdAt: serverTimestamp() // Audit trail[cite: 15]
      });
      
      Alert.alert('Success', `${newName} has been registered!`);
      setNewName('');
      setNewRole('');
      setActiveTab('list');
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert('Error', 'Failed to register staff.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Staff Management</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'list' && styles.activeTab]} 
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Staff List</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'add' && styles.activeTab]} 
          onPress={() => setActiveTab('add')}
        >
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>Register New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {activeTab === 'list' ? (
          /* Staff List Section */
          loading ? (
            <ActivityIndicator size="large" color="#673AB7" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={staffList}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.staffCard}>
                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{item.displayName}</Text>
                    <Text style={styles.staffRole}>{item.workerRole}</Text>
                  </View>
                  {/* Dynamic Status Badge[cite: 15] */}
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: item.status === 'On Duty' ? '#E8F5E9' : '#FFEBEE' }
                  ]}>
                    <Text style={[
                      styles.statusText, 
                      { color: item.status === 'On Duty' ? '#2E7D32' : '#C62828' }
                    ]}>
                      {item.status || 'Off Duty'}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No workers registered yet.</Text>
              }
            />
          )
        ) : (
          /* Registration Form Section[cite: 15] */
          <ScrollView contentContainerStyle={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Muhammad Ahmad" 
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.label}>Worker Role</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Washer / Supervisor" 
              value={newRole}
              onChangeText={setNewRole}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
              <Text style={styles.submitButtonText}>Register Staff</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
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
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: 'bold', marginRight: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#673AB7' },
  tabText: { color: '#888', fontWeight: '600' },
  activeTabText: { color: '#673AB7' },
  container: { flex: 1, padding: 20 },
  staffCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    alignItems: 'center',
    elevation: 1,
  },
  staffInfo: { flex: 1 },
  staffName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  staffRole: { fontSize: 14, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  form: { paddingBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 8 },
  input: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#DDD', 
    marginBottom: 20 
  },
  submitButton: { 
    backgroundColor: '#673AB7', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});