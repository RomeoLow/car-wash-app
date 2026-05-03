import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Firestore methods for data operations
import { 
  collection, query, where, onSnapshot, 
  addDoc, serverTimestamp, doc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function StaffManagementScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('list'); // Controls 'Staff List' vs 'Register New' tabs
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Staff with Real-time Listener (Excluding Customers)
  useEffect(() => {
    // Filter: Only fetch users where role is 'worker' or 'staff'
    const q = query(
      collection(db, 'users'), 
      where('role', 'in', ['worker', 'staff'])
    );
    
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

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // 2. Add new staff to Firestore
  const handleRegister = async () => {
    if (!newName || !newRole) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await addDoc(collection(db, 'users'), {
        displayName: newName,
        role: 'worker', // Ensures they are categorized as staff, not customers
        workerRole: newRole,
        status: 'Off Duty', // Default status for new entries
        createdAt: serverTimestamp(),
      });
      setNewName('');
      setNewRole('');
      setActiveTab('list');
      Alert.alert('Success', 'New staff member registered.');
    } catch (error) {
      console.error("Add staff error:", error);
      Alert.alert('Error', 'Failed to register staff');
    }
  };

  // 3. Toggle staff status (On Duty <-> Off Duty)
  const toggleStatus = async (staffId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'On Duty' ? 'Off Duty' : 'On Duty';
      const staffRef = doc(db, 'users', staffId);
      await updateDoc(staffRef, { status: newStatus });
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  // 4. Delete staff from database
  const handleDeleteStaff = (staffId: string, staffName: string) => {
    Alert.alert(
      "Remove Staff",
      `Are you sure you want to delete ${staffName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', staffId));
            } catch (error) {
              console.error("Delete error:", error);
            }
          } 
        }
      ]
    );
  };

  // Render individual staff card UI
  const renderStaffItem = ({ item }: any) => (
    <View style={styles.staffCard}>
      {/* Tap info area to toggle status */}
      <TouchableOpacity 
        style={styles.staffInfo} 
        onPress={() => toggleStatus(item.id, item.status)}
      >
        <Text style={styles.staffName}>{item.displayName}</Text>
        <Text style={styles.staffRole}>{item.workerRole}</Text>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        {/* Status Indicator Badge */}
        <TouchableOpacity 
          onPress={() => toggleStatus(item.id, item.status)}
          style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'On Duty' ? '#E8F5E9' : '#FFEBEE' }
          ]}
        >
          <Text style={[
            styles.statusText, 
            { color: item.status === 'On Duty' ? '#2E7D32' : '#C62828' }
          ]}>
            {item.status || 'Off Duty'}
          </Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={() => handleDeleteStaff(item.id, item.displayName)}
        >
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Staff Management</Text>
      </View>

      {/* Tab Controls */}
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
          loading ? (
            <ActivityIndicator size="large" color="#673AB7" style={{marginTop: 50}} />
          ) : (
            <FlatList
              data={staffList}
              renderItem={renderStaffItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text style={styles.emptyText}>No staff registered yet.</Text>}
            />
          )
        ) : (
          <ScrollView style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. John Doe"
              value={newName}
              onChangeText={setNewName}
            />
            
            <Text style={styles.label}>Job Role</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Senior Washer"
              value={newRole}
              onChangeText={setNewRole}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
              <Text style={styles.submitBtnText}>Register Staff</Text>
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
    flexDirection: 'row', alignItems: 'center', padding: 20, 
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' 
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
    marginBottom: 12, 
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  staffInfo: { flex: 1 },
  staffName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  staffRole: { fontSize: 13, color: '#666', marginTop: 2 },
  
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  deleteBtn: { marginLeft: 15, padding: 5 },

  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  form: { paddingTop: 10 },
  label: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#DDD', fontSize: 16 },
  submitBtn: { backgroundColor: '#673AB7', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});