// app/tabs/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "tomato" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ChatBot"
        options={{
          title: "Chatbot",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ARVRScreen"
        options={{
          title: "AR/VR",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="glasses-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
