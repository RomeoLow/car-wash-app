import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>[ Profile Info & Saved Plates Go Here ]</Text>
        {/* TEAMMATE: Build the UI for user loyalty points and saved vehicles here! */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1C1C2E' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { color: '#5A5A78', fontSize: 16 },
});