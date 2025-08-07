// app/SwiperScreen.tsx
import React from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import ARVRScreen from './arvr';
import Chatbot from './chatbot';
import HomeScreen from './components/HomeScreen';

const { width } = Dimensions.get('window');

export default function SwiperScreen() {
  const screens = [
    { key: 'arvr', component: <ARVRScreen /> },
    { key: 'home', component: <HomeScreen /> },
    { key: 'chatbot', component: <Chatbot /> },
  ];

  return (
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={screens}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <View style={{ width }}>
          {item.component}
        </View>
      )}
    />
  );
}
