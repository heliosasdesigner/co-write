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
import Chat from "./src/screens/Chat";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import SearchPage from "./src/screens/SearchPage";
import NewStoryPage from "./src/screens/NewStoryPage";
import StoryRoomsPage from "./src/screens/StoryRoomsPage";
import ProfilePage from "./src/screens/ProfilePage";
import Chat2List from "./src/screens/Chat2List";
import Chat2 from "./src/screens/Chat2";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <View style={styles.header}>
          <Text style={styles.title}>Hello! this is co-write</Text>
          <Text style={styles.subtitle}>This is a subtitle</Text>
        </View>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Search" component={SearchPage} />
          <Stack.Screen name="New Story" component={NewStoryPage} />
          <Stack.Screen name="Story Rooms" component={StoryRoomsPage} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Chats" component={Chat} />
        </Stack.Navigator>

        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AuthStack() {
  return (
    <GestureHandlerRootView>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}

function MainStack() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Home" component={LandingPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="New Story" component={NewStoryPage} />
        <Stack.Screen name="Story Rooms" component={StoryRoomsPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Chats" component={Chat} />
        <Stack.Screen name="Chat List" component={Chat2List} />
        <Stack.Screen name="ChatScreen" component={Chat2} />
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
