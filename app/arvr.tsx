import axios from 'axios';
import { Camera, CameraView } from 'expo-camera'; // Updated import
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ARVRScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [prediction, setPrediction] = useState<string>('Detecting...');
  const cameraRef = useRef<CameraView>(null); // Use CameraView type

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const captureAndDetect = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);

      try {
        const response = await axios.post('http://YOUR_PC_IP:10000/predict/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPrediction(response.data.prediction);
      } catch (error) {
        console.error(error);
        setPrediction('Error detecting object');
      }
    }
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Requesting Camera Permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} /> {/* Correct Component */}
      <TouchableOpacity style={styles.button} onPress={captureAndDetect}>
        <Text style={styles.buttonText}>Detect Object</Text>
      </TouchableOpacity>
      <Text style={styles.prediction}>Result: {prediction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  button: {
    backgroundColor: '#6a11cb',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  prediction: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
    color: '#fff',
    backgroundColor: '#000',
    padding: 10,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
