import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

// Define the type interface of menu items
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
}

export default function AdminScreen({ navigation }: any) {
  // Handle logout
  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };

  // Management feature configuration list
  // Note: The screen string here must match exactly with the Stack.Screen name in your AppNavigator
  const menuItems: MenuItem[] = [
    { id: 'revenue', label: 'Daily Revenue', icon: '💰', screen: 'RevenueReports' },
    { id: 'staff', label: 'Manage Staff', icon: '👥', screen: 'StaffManagement' },
    { id: 'reports', label: 'Reports', icon: '📊', screen: 'RevenueReports' },
    { id: 'settings', label: 'Settings', icon: '⚙️', screen: 'ServiceSettings' },
  ];
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
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Status Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Today's Status</Text>
          <View style={styles.overviewRow}>
            <View>
              <Text style={styles.overviewLabel}>Active Jobs</Text>
              <Text style={styles.boldText}>8</Text>
            </View>
            <View style={styles.divider} />
            <View>
              <Text style={styles.overviewLabel}>Staff Online</Text>
              <Text style={styles.boldText}>3</Text>
            </View>
          </View>
        </View>

        {/* Feature Grid Entry */}
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
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen);
                }
              }}
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
  safe: { 
    flex: 1, 
    backgroundColor: '#F0F2F5' 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 15, 
    marginBottom: 20 
  },
  badgeContainer: { 
    alignSelf: 'flex-start' 
  },
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
  logoutText: { 
    color: '#F44336', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  greeting: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
    marginBottom: 20 
  },
  
  // Status Overview Card Styles
  overviewCard: {
    backgroundColor: '#673AB7',
    padding: 20,
    borderRadius: 24,
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#673AB7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  overviewTitle: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 14, 
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  overviewRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  overviewLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginBottom: 4
  },
  boldText: { 
    color: '#fff',
    fontWeight: 'bold', 
    fontSize: 24 
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },

  // Feature Grid Styles
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    paddingBottom: 20
  },
  gridItem: { 
    width: '47%', 
    backgroundColor: '#fff', 
    paddingVertical: 25, 
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  icon: { 
    fontSize: 30 
  },
  gridLabel: { 
    fontWeight: 'bold', 
    color: '#444', 
    fontSize: 14 
  }
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