import { SafeAreaView, Text, View, ActivityIndicator } from "react-native";
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
import NavBar from "./src/navigation/NavBar";

import SearchPage from "./src/screens/SearchPage";
import Chat2NewChat from "./src/screens/Chat2NewChat";
import StoryRoomsPage from "./src/screens/StoryRoomsPage";
import ProfilePage from "./src/screens/ProfilePage";
import Chat2List from "./src/screens/Chat2List";
import Chat2 from "./src/screens/Chat2";
import StoryDetailsPage from "./src/screens/StoryDetailsPage";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { appStyles } from "./src/styles";
import {
  AuthenticatedUserProvider,
  AuthenticatedUserContext,
} from "./src/contexts/AuthenticatedUser";

const Stack = createStackNavigator();

function ChatStack() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <View style={appStyles.header}>
          <Text style={appStyles.title}>Hello! this is co-write</Text>
          <Text style={appStyles.subtitle}>This is a subtitle</Text>
        </View>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Search" component={SearchPage} />
          <Stack.Screen name="New Story" component={Chat2NewChat} />
          <Stack.Screen name="Story Rooms" component={Chat2List} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Chats" component={Chat2} />
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
        <Stack.Screen
          name="Login"
          component={Login as React.ComponentType<any>}
        />
        <Stack.Screen
          name="Signup"
          component={Signup as React.ComponentType<any>}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}

function MainStack() {
  return (
    <GestureHandlerRootView style={appStyles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Home" component={LandingPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="New Story" component={Chat2NewChat} />
        <Stack.Screen name="Story Rooms" component={Chat2List} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Chats" component={Chat2} />
        <Stack.Screen name="Chat List" component={Chat2List} />
        <Stack.Screen name="ChatScreen" component={Chat2} />
        <Stack.Screen name="StoryDetails" component={StoryDetailsPage} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={appStyles.container}>
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
