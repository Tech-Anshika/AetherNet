import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ARVRScreen from '../arvr';
import Chatbot from '../chatbot';
import HomeScreen from '../components/HomeScreen';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Chatbot') {
            iconName = 'chatbubbles';
          } else if (route.name === 'ARVR') {
            iconName = 'cube';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chatbot" component={Chatbot} />
      <Tab.Screen name="ARVR" component={ARVRScreen} />
    </Tab.Navigator>
  );
}
