import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all the screens you just created
import LoginScreen from './src/screens/LoginScreen';
import BookingScreen from './src/screens/BookingScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Car Wash Login' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book a Service' }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin Dashboard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}