import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export default function JobDetailScreen({ navigation, route }: any) {
  // We will pass the specific booking data through the route params later
  const job = route?.params?.job || { plate: 'UNKNOWN' };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back to Queue</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Job Details</Text>
        <View style={{ width: 100 }} /> {/* Spacer */}
      </View>

      <View style={styles.content}>
        <Text style={styles.plate}>{job.plate}</Text>
        <Text style={styles.placeholder}>[ Full Wash Instructions Go Here ]</Text>
        {/* TEAMMATE: Build the UI showing exact services needed, and a big "Mark Complete" button! */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  plate: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 20 },
  placeholder: { color: '#666', fontSize: 16 },
});