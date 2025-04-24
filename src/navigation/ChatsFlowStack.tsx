import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Components
import Chat2NewChat from "../screens/Chat2NewChat";
import Chat2List from "../screens/Chat2List";
import Chat2 from "../screens/Chat2";

// Define the chat flow navigation parameter list
export type ChatsFlowParamList = {
  "Story Rooms": undefined;
  Profile: undefined;
  "New Story": {
    onCreateChat: (
      otherUserId: string,
      aiAssistant: boolean,
      title: string,
      topic: string,
      wordLimit: number,
      numberOfPages?: string
    ) => void;
  };
  Chat2: {
    chatId: string;
    topic?: string;
    title?: string;
    aiAssistant?: boolean;
    wordLimit?: string;
    numberOfPages?: string;
  };
};

// Use ChatsFlowParamList as the root stack param list
export type RootStackParamList = ChatsFlowParamList;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Stack = createStackNavigator<ChatsFlowParamList>();

const ChatsFlowStack: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#007AFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Story Rooms"
          component={Chat2List}
          options={{
            headerTitle: "Story Rooms",
          }}
        />
        <Stack.Screen
          name="New Story"
          component={Chat2NewChat}
          options={{
            headerTitle: "Create Story",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="Chat2"
          component={Chat2}
          options={{
            headerTitle: "Story Chat",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Story Rooms")}
                style={styles.headerButton}
              >
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
                <Text style={styles.headerButtonText}>Story Rooms</Text>
              </TouchableOpacity>
            ),
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerButton: {
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerButtonText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 4,
  },
});

export default ChatsFlowStack;
