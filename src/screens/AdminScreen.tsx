import { View, Text, StyleSheet } from 'react-native';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text>Admin Screen - Teammate C starts here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});