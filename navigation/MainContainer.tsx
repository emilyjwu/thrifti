import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import ExploreScreen from './screens/ExploreScreen';
import ListItemScreen  from './screens/SellScreen/ListItemScreen';
import SellScreen from './screens/SellScreen/SellScreenMain';
import MessageScreen from './screens/MessageScreen';
import RequestsScreen from './screens/RequestsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdditionalInformationScreen from './screens/SellScreen/AdditionalInfoScreen';


// Screen names
const exploreName = "Explore";
const sellName = "Sell";
const messageName = "Message";
const requestName = "Request";
const profileName = "Profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const SellStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="Bins" component={SellScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ListItemScreen" component={ListItemScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="AdditionalInformationScreen" component={AdditionalInformationScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

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

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            height: 100,
            paddingVertical: 5,
            paddingHorizontal: 10,
          },
          tabBarActiveTintColor: '#9747FF',
          tabBarInactiveTintColor: '#9DB2CE',
          tabBarLabelStyle: { fontSize: 10, paddingBottom: 10 },
        })}
      >
        <Tab.Screen name={requestName} component={RequestsScreen} />
        <Tab.Screen name="Sell" component={SellStack} />
        <Tab.Screen name={exploreName} component={ExploreScreen} />
        <Tab.Screen name={messageName} component={MessageScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
      </Tab.Navigator>

    </NavigationContainer>
  );
}

export default MainContainer;


