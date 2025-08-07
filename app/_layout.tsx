import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';

const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey || '';

export default function Layout() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SignedIn>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="components/AuthScreen" />
        </Stack>
      </SignedOut>
    </ClerkProvider>
  );
}
