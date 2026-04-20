import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Simulate employee data
const MOCK_STAFF = [
  { id: '1', name: 'Ali Bin Abu', role: 'Full-time Washer', status: 'On Duty' },
  { id: '2', name: 'John Tan', role: 'Part-time Washer', status: 'Off Duty' },
  { id: '3', name: 'Siti Aminah', role: 'Supervisor', status: 'On Duty' },
];

export default function StaffManagementScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleRegister = () => {
    if (!newName || !newRole) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', `${newName} has been registered!`);
    setNewName('');
    setNewRole('');
    setActiveTab('list');
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
          /* 1. Staff List Section */
          <FlatList
            data={MOCK_STAFF}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.staffCard}>
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{item.name}</Text>
                  <Text style={styles.staffRole}>{item.role}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'On Duty' ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Text style={[styles.statusText, { color: item.status === 'On Duty' ? '#2E7D32' : '#C62828' }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          /* 2. Registration Form Section */
          <ScrollView contentContainerStyle={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Muhammad Ahmad" 
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.label}>Role</Text>
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

  // Tab Styles
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#673AB7' },
  tabText: { color: '#888', fontWeight: '600' },
  activeTabText: { color: '#673AB7' },

  container: { flex: 1, padding: 20 },

  // List Styles
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

  // Form Styles
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