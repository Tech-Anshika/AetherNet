import { useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import SplashScreen from './components/SplashScreen';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // show splash screen for 3 seconds
    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isSignedIn) {
    return <AuthScreen />;
  }

  return <HomeScreen />;
}
