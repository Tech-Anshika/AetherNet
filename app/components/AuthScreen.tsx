// app/components/AuthScreen.tsx
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function AuthScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Parallax tilt values
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);
    const subscription = Accelerometer.addListener(({ x, y }) => {
      tiltX.value = withSpring(x * 20);
      tiltY.value = withSpring(y * 20);
    });
    scale.value = withRepeat(withTiming(1.05, { duration: 4000 }), -1, true);
    return () => subscription && subscription.remove();
  }, [scale, tiltX, tiltY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tiltX.value },
      { translateY: tiltY.value },
      { scale: scale.value },
    ],
  }));

  const handleAuth = () => {
    if (isSignUp && !username.trim()) {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to your HomeScreen component; adjust path if your route is different
      router.replace('/components/HomeScreen');
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Image
          source={require('../../assets/space-3d(2).gif')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.overlay}>
        <Text style={styles.title}>🚀 DETECT-X</Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? 'Create your account to explore the universe with us.'
            : 'Sign in to continue your space journey.'}
        </Text>

        {isSignUp && (
          <TextInput
            placeholder="Choose a username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
            editable={!loading}
          />
        )}

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          editable={!loading}
        />
        <TextInput
          placeholder={isSignUp ? 'Set a password' : 'Enter your password'}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={handleAuth}
          disabled={loading}
          style={{ width: '85%' }}
        >
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            {loading && (
              <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text style={styles.buttonText}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} disabled={loading}>
          <Text style={styles.switchText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don’t have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#6a11cb',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: 'rgba(31,42,72,0.85)',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    width: '85%',
    marginBottom: 12,
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  switchText: { color: '#aaa', fontSize: 13, marginTop: 16 },
});
