import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export default function RevenueReportsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Revenue Reports</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>[ Charts and Income Stats Go Here ]</Text>
        {/* TEAMMATE: Build the UI for daily/weekly/monthly earnings (bar charts or simple lists) */}
      </View>
    </SafeAreaView>
  );
}

// Reuse the exact same styles as StaffManagementScreen
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', elevation: 2 },
  backButton: { color: '#673AB7', fontSize: 16, fontWeight: 'bold', marginRight: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  placeholder: { color: '#888', fontSize: 16 },
});