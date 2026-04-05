import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Car Wash App - Team Hub</Text>
      
      {/* Button for Teammate A */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#2196F3' }]} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Go to Login (Team A)</Text>
      </TouchableOpacity>

      {/* Button for Teammate B */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#4CAF50' }]} 
        onPress={() => navigation.navigate('Booking')}
      >
        <Text style={styles.buttonText}>Go to Booking (Team B)</Text>
      </TouchableOpacity>

      {/* Button for Teammate C */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#FF9800' }]} 
        onPress={() => navigation.navigate('Admin')}
      >
        <Text style={styles.buttonText}>Go to Admin (Team C)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  button: { width: '100%', padding: 15, borderRadius: 10, marginVertical: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});