// app/components/SplashScreen.tsx
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/space-opening.gif')} // Your opening gif
        style={styles.gif}
        resizeMode="contain" // prevent cropping
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 250,      // Fixed width for better mobile display
    height: 250,     // Fixed height for better mobile display
    borderRadius: 10, // Optional: rounded corners for aesthetics
  },
});
