import * as React from "react";
import MainContainer from "./navigation/MainContainer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./database/index";
import { PostHogProvider } from "posthog-react-native";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContainer />
    </AuthProvider>
  );
};

export default App;
