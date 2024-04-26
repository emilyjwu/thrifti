import { useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../database/index";

// Screens
import ExploreScreen from "./Explore/ExploreScreen";
import ListItemScreen from "./Sell/ListItemScreen";
import SellScreen from "./Sell/SellScreen";
import MessageScreen from "./Messaging/MessageScreen";
import RequestsScreen from "./Requests/RequestsScreen";
import RequestListing from "./Requests/RequestListing";
import ProfileScreen from "./Profile/ProfileScreen";
import MyRequests from "./Requests/MyRequests";
import CreateRequest from "./Requests/CreateRequest";
import AdditionalInformationScreen from "./Sell/AdditionalInfoScreen";
import LoginScreen from "./Login/LoginScreen";
import SignupScreen from "./Login/SignupScreen";
import Listing from "../components/Listing";
import ExpandBin from "../components/ExpandBin";
import ListingScroll from "../components/ListingScroll";
import FilteredFeed from "./Explore/FilteredFeed";
import SearchScreen from "./Explore/SearchScreen";
import UserList from "./Profile/UserList";
import Chat from "./Messaging/Chat";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "../database/index";
import EditProfile from "./Profile/EditProfile";

// Screen names
const exploreName = "Explore";
const sellName = "Sell";
const messageName = "Message";
const requestName = "Request";
const profileName = "Profile";
const loginName = "LoginScreen";
const signupName = "SignupScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

interface ProfileScreenParams {
  userID?: string;
}

const MessageStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Messages"
      component={MessageScreen}
      options={{ headerShown: true }}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Listing"
      component={Listing}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const ExploreStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="ExploreFeed"
      component={ExploreScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FilteredFeed"
      component={FilteredFeed}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Listing"
      component={Listing}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ExpandBin"
      component={ExpandBin}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ListingScroll"
      component={ListingScroll}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const RequestStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="RequestFeed"
      component={RequestsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RequestListing"
      component={RequestListing}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MyRequests"
      component={MyRequests}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateRequest"
      component={CreateRequest}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const SellStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Bins"
      component={SellScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ListItemScreen"
      component={ListItemScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AdditionalInformationScreen"
      component={AdditionalInformationScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const ProfileStack = ({ navigation }) => {
  const { currentUserID } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" options={{ headerShown: false }}>
        {(props) => (
          <ProfileScreen
            {...props}
            route={{
              ...props.route,
              params: { ...props.route.params, userID: currentUserID },
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtherProfile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// ***** TODO: Implement tutorial *****
const TutorialStack = ({ setIsLoggedIn }) => {
  // thought this should include Login and Signup but did not know how
};

const MainContainer: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const login = (emailIn) => {
    console.log(emailIn);
    posthog.identify(emailIn, {
      // Replace "distinct_id" with your user's unique identifier
      email: emailIn, // optional: set additional user properties
    });
    setIsLoggedIn(true);
  };

  // ***** TODO: Add 'Sign up' route for tutorial *****
  // *****    using the Tutorial Stack i think    *****
  if (!isNewUser && !isLoggedIn) {
    return (
      <LoginScreen
        onLogin={(email) => login(email)}
        onSignUp={() => setIsNewUser(true)}
      />
    );
  } else if (isNewUser) {
    return (
      <SignupScreen
        onSignUp={() => setIsNewUser(false)}
        onReturn={() => setIsNewUser(false)}
      />
    );
  } else {
    return (
      <NavigationContainer>
        <PostHogProvider client={posthog}>
          <Tab.Navigator
            initialRouteName={exploreName}
            screenOptions={({ route }) => {
              const iconMappings = {
                [exploreName]: { icon: "home", library: Ionicons },
                [sellName]: { icon: "pricetags", library: Ionicons },
                [messageName]: { icon: "chatbubble", library: Ionicons },
                [requestName]: { icon: "help-circle", library: Ionicons },
                [profileName]: { icon: "person-circle", library: Ionicons },
              };

              const getTabIcon = (routeName, focused, size, color) => {
                const { icon, library } = iconMappings[routeName] || {};
                if (icon && library) {
                  const IconComponent = library;
                  const iconName = focused ? icon : `${icon}-outline`;
                  return (
                    <IconComponent name={iconName} size={size} color={color} />
                  );
                }
                return null;
              };

              return {
                tabBarIcon: ({ focused, color, size }) =>
                  getTabIcon(route.name, focused, size, color),
                tabBarStyle: {
                  height: 100,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                },
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: { fontSize: 10, paddingBottom: 10 },
              };
            }}
          >
            <Tab.Screen name="Request" component={RequestStack} />
            <Tab.Screen name="Sell" component={SellStack} />
            <Tab.Screen name="Explore" component={ExploreStack} />
            <Tab.Screen
              name="Message"
              component={MessageStack}
              options={{ headerShown: false }}
            />
            <Tab.Screen name="Profile" component={ProfileStack} />
          </Tab.Navigator>
        </PostHogProvider>
      </NavigationContainer>
    );
  }
};

export default MainContainer;
