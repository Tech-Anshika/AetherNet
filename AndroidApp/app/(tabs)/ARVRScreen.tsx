import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ARVRScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const pickVideoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const pickedVideoUri = result.assets[0].uri;
      setVideoUri(pickedVideoUri);
      console.log('Selected Video URI:', pickedVideoUri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickVideoFromGallery} style={styles.button}>
        <Text style={styles.text}>Select Video from Gallery</Text>
      </TouchableOpacity>

      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#0a84ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  video: {
    width: '100%',
    height: 300,
  },
});
