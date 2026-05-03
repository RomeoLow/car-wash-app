import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Firestore imports for real-time tracking
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { signOut } from 'firebase/auth';

// Define the type interface of menu items
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
  accent: string;
}

export default function AdminScreen({ navigation }: any) {
  // Handle logout
  const handleLogout = () => {
    signOut(auth).catch(err => console.log(err));
  };

  // Management feature configuration list
  // Note: The screen string here must match exactly with the Stack.Screen name in your AppNavigator
  const menuItems: MenuItem[] = [
    { id: 'revenue', label: 'Daily Revenue', icon: '💰', screen: 'RevenueReports' },
    { id: 'staff', label: 'Manage Staff', icon: '👥', screen: 'StaffManagement' },
    { id: 'reports', label: 'Reports', icon: '📊', screen: 'RevenueReports' },
    { id: 'settings', label: 'Settings', icon: '⚙️', screen: 'ServiceSettings' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Text style={styles.adminBadge}>ADMIN PANEL</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionLabel}>Operations Overview</Text>

        {/* Operational Performance Card (Real-time) */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeader}>CURRENT WORKSHOP LOAD</Text>
          <View style={styles.statsRow}>
            {/* Real-time Washing Count */}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{washingCount}</Text>
              <Text style={styles.statLabel}>Washing</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            {/* Real-time Pending Count */}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Combined Efficiency Metric (Mock calculation) */}
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>High</Text>
              <Text style={styles.statLabel}>Efficiency</Text>
            </View>
          </View>
        </View>

        {/* Feature Grid Entry */}
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
            >
              <View style={[styles.iconBox, { backgroundColor: item.accent + '15' }]}>
                <Text style={styles.gridIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={styles.gridArrow}>View →</Text>
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
});