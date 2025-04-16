import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewStoryPage from "../screens/NewStoryPage";
import Chats from "../screens/Chats"; // the existing Chats.tsx
import { StyleSheet, View } from "react-native";
import NavBar from "./NavBar";

export type ChatsFlowParamList = {
  NewStory: undefined;
  ChatConversation: {
    topic?: string;
    aiAssistant?: boolean;
    wordLimit?: string;
    numberOfPages?: string;
  };
};

const Stack = createStackNavigator<ChatsFlowParamList>();

export default function ChatsFlowStack() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="NewStory" component={NewStoryPage} />
          <Stack.Screen name="ChatConversation" component={Chats} />
        </Stack.Navigator>
      </View>
      <NavBar currentTab="Chats" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
