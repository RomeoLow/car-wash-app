import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

// Assuming you are using React Navigation
export default function AdminScreen({ navigation }: any) {
  const handleLogout = () => signOut(auth);

  // Assuming you are using React Navigation
  const menuItems = [
    { id: 'revenue', label: 'Daily Revenue', icon: '💰', screen: 'RevenueReports' },
    { id: 'staff', label: 'Manage Staff', icon: '👥', screen: 'StaffManagement' },
    { id: 'reports', label: 'Reports', icon: '📊', screen: 'RevenueReports' }, // You can also jump to the same or different reports.
    { id: 'settings', label: 'Settings', icon: '⚙️', screen: 'ServiceSettings' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Text style={styles.adminBadge}>ADMIN PANEL</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>Management Dashboard</Text>

        {/* Statistics Overview Area (Makes the page look more professional) */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Today's Status</Text>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewItem}>Active Jobs: <Text style={styles.bold}>8</Text></Text>
            <Text style={styles.overviewItem}>Staff Online: <Text style={styles.bold}>3</Text></Text>
          </View>
        </View>

        {/* Function Grid */}
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.gridItem}
              activeOpacity={0.8}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 20, 
    marginBottom: 20 
  },
  badgeContainer: { alignSelf: 'flex-start' },
  adminBadge: { 
    backgroundColor: '#673AB7', 
    color: '#fff', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    fontSize: 12, 
    fontWeight: 'bold',
    overflow: 'hidden'
  },
  logoutText: { color: '#F44336', fontWeight: 'bold', fontSize: 16 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
  
  // Overview Card
  overviewCard: {
    backgroundColor: '#673AB7',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#673AB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  overviewTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 10 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  overviewItem: { color: '#fff', fontSize: 16 },
  bold: { fontWeight: 'bold', fontSize: 18 },

  // Function Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { 
    width: '47%', 
    backgroundColor: '#fff', 
    paddingVertical: 30, 
    borderRadius: 24, 
    marginBottom: 20, 
    alignItems: 'center', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    backgroundColor: '#F5F3FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  icon: { fontSize: 28 },
  gridLabel: { fontWeight: 'bold', color: '#444', fontSize: 14 }
});