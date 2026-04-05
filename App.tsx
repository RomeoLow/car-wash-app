import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen'; // The new hub
import LoginScreen from './src/screens/LoginScreen';
import BookingScreen from './src/screens/BookingScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* Setting initialRouteName to "Home" makes this the landing page */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Team Development Hub' }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}