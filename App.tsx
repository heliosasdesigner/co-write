import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { createContext, useEffect, useState, useContext } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { auth } from "./firebase/config";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingPage from "./src/screens/LandingPage";
import Login from "./src/screens/Login";
import Sugnup from "./src/screens/Sugnup";
import NavBar from "./src/navigation/NavBar";
import SearchPage from "./src/screens/SearchPage";
import NewStoryPage from "./src/screens/NewStoryPage";
import StoryRoomsPage from "./src/screens/StoryRoomsPage";
import ProfilePage from "./src/screens/ProfilePage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  AuthenticatedUserProvider,
  AuthenticatedUserContext,
} from "./src/contexts/AuthenticatedUser";

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <GestureHandlerRootView>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Sugnup" component={Sugnup} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}

function MainStack() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Home" component={LandingPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="New Story" component={NewStoryPage} />
        <Stack.Screen name="Story Rooms" component={StoryRoomsPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  console.log("🔍 App is starting...");
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "normal",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "black",
  },
});
