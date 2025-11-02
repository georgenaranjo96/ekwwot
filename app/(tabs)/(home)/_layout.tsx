import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'VIN Scanner'
        }}
      />
      <Stack.Screen
        name="scanner"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'Vehicle Details',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
