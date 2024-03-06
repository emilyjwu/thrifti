import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import ExploreScreen from './screens/ExploreScreen';
import SellScreen from './screens/SellScreen';
import MessageScreen from './screens/MessageScreen';
import RequestsScreen from './screens/RequestsScreen';
import ProfileScreen from './screens/ProfileScreen';

// Screen names
const exploreName = "Explore";
const sellName = "Sell";
const messageName = "Message";
const requestName = "Request";
const profileName = "Profile";

const Tab = createBottomTabNavigator();

const MainContainer: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={exploreName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeName = route.name;

            if (routeName === exploreName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (routeName === sellName) {
              iconName = focused ? 'cube' : 'cube-outline';
            } else if (routeName === messageName) {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            } else if (routeName === requestName) {
              iconName = focused ? 'help-circle' : 'help-circle-outline';
            } else if (routeName === profileName) {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            height: 100,
            paddingVertical: 5, // Adjust the vertical padding
            paddingHorizontal: 10, // Adjust the horizontal padding
          },
          tabBarActiveTintColor: '#9747FF',
          tabBarInactiveTintColor: '#9DB2CE',
          tabBarLabelStyle: { fontSize: 10, paddingBottom: 10 },
        })}
      >
        <Tab.Screen name={requestName} component={RequestsScreen} />
        <Tab.Screen name={sellName} component={SellScreen} />
        <Tab.Screen name={exploreName} component={ExploreScreen} />
        <Tab.Screen name={messageName} component={MessageScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
