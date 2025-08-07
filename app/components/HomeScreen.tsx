import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const API_URL = 'https://DETECT-X.onrender.com'; 

  // Floating animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startFloating = (anim: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 15, duration: 3000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: -15, duration: 3000, useNativeDriver: true }),
        ])
      ).start();
    };
    startFloating(floatAnim1);
    startFloating(floatAnim2);
    startFloating(floatAnim3);
  }, []);

  const pickImage = async (fromCamera: boolean) => {
    let result;
    if (fromCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({ quality: 1 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    }

    if (!result.canceled) {
      await sendImageToModel(result.assets[0].uri);
    }
  };

  const sendImageToModel = async (imageUri: string) => {
    try {
      setLoading(true);
      setResults([]);
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();
      setResults(data.predictions || []);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while detecting objects.');
    } finally {
      setLoading(false);
    }
  };

  const openPickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose from where you want to pick an image.',
      [
        { text: 'Camera', onPress: () => pickImage(true) },
        { text: 'Gallery', onPress: () => pickImage(false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/space-3d.gif')} style={StyleSheet.absoluteFill} contentFit="cover" />

      <View style={styles.overlay}>
        <Text style={styles.title}>🚀 DETECT-X</Text>

        {/* Earth for Object Detection */}
        <Animated.View style={[styles.floatingButton, { top: height / 3, left: width / 6, transform: [{ translateY: floatAnim1 }] }]}>
          <TouchableOpacity onPress={openPickerOptions}>
            <Image source={require('../../assets/earth.png')} style={styles.planetImage} />
            <Text style={styles.planetLabel}>Detect</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Mars for AR/VR */}
        <Animated.View style={[styles.floatingButton, { top: height / 2.3, left: width / 1.7, transform: [{ translateY: floatAnim2 }] }]}>
          <TouchableOpacity onPress={() => router.push('/arvr')}>
            <Image source={require('../../assets/mars.png')} style={styles.planetImage} />
            <Text style={styles.planetLabel}>AR/VR</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Saturn for ChatBot */}
        <Animated.View style={[styles.floatingButton, { top: height / 1.5, left: width / 3, transform: [{ translateY: floatAnim3 }] }]}>
          <TouchableOpacity onPress={() => router.push('/chatbot')}>
            <Image source={require('../../assets/saturn.jpg')} style={styles.planetImage} />
            <Text style={styles.planetLabel}>ChatBot</Text>
          </TouchableOpacity>
        </Animated.View>

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

        {results.length > 0 && (
          <ScrollView style={{ marginTop: 20, maxHeight: 200, width: '80%' }}>
            {results.map((item, index) => (
              <Text key={index} style={{ color: '#fff', fontSize: 16, marginBottom: 5 }}>
                {item.label} - {(item.confidence * 100).toFixed(2)}%
              </Text>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1 },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
    marginTop: 50,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    alignItems: 'center',
  },
  planetImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  planetLabel: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '700',
  },
});
