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
import Chat from "./src/screens/Chats";
import Login from "./src/screens/Login";
import Sugnup from "./src/screens/Sugnup";
import Search from "./src/screens/SearchPage";
import NewStory from "./src/screens/NewStoryPage";
import StoryRooms from "./src/screens/StoryRoomsPage";
import Profile from "./src/screens/ProfilePage";
import StoryDetailsPage from "./src/screens/StoryDetailsPage";
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
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="New Story" component={NewStory} />
          <Stack.Screen name="Story Rooms" component={StoryRooms} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Chats" component={Chat} />
          <Stack.Screen name="StoryDetails" component={StoryDetailsPage} />
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
        <Stack.Screen name="Sugnup" component={Sugnup} />
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
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
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
