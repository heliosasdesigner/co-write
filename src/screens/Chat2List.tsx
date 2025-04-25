import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  setDoc,
  doc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import PageLayout from "../components/PageLayout";
import { chatListStyles, headerStyles, storyRoomsStyles } from "../styles";

type RootStackParamList = {
  ChatScreen: {
    chatId: string;
    topic?: string;
    title?: string;
    aiAssistant?: boolean;
    wordLimit?: string;
    numberOfPages?: string;
  };
  ChatList: undefined;
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
};

type NavigationProp = StackNavigationProp<RootStackParamList, "ChatScreen">;

type Chat = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: any;
  otherUser: string;
  title?: string;
  topic?: string;
  aiAssistant?: boolean;
  wordLimit?: number;
  numberOfPages?: number;
  isFinished?: boolean;
};

const EmptyState = () => (
  <View style={chatListStyles.emptyContainer}>
    <Ionicons name="book-outline" size={48} color="#666" />
    <Text style={chatListStyles.emptyText}>
      No stories yet. Start a new story by tapping the button below!
    </Text>
  </View>
);

const ChatListScreen = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const navigation = useNavigation<NavigationProp>();

  const user = auth.currentUser;
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList: Chat[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          participants: data.participants,
          lastMessage: data.lastMessage,
          lastMessageTimestamp: data.lastMessageTimestamp,
          otherUser: data.participants.find((p: string) => p !== user.uid),
          title: data.title,
          topic: data.topic,
          aiAssistant: data.aiAssistant,
          wordLimit: data.wordLimit,
          numberOfPages: data.numberOfPages,
          isFinished: data.isFinished || false,
        };
      });
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateChat = async (
    otherUserId: string,
    aiAssistant: boolean,
    title: string,
    topic: string,
    wordLimit: number,
    numberOfPages?: string
  ) => {
    try {
      if (!auth.currentUser?.email) {
        Alert.alert("Error", "You must be logged in to create a story");
        return;
      }

      const storyData = {
        topic: topic.trim(),
        title: title.trim(),
        userId: auth.currentUser.email,
        aiAssistant,
        wordLimit,
        numberOfPages: numberOfPages || "12",
        isFinished: false,
        createdAt: new Date(),
        lastMessage: "Story started",
        lastMessageTimestamp: new Date(),
        votes: 0,
      };

      const docRef = await addDoc(collection(db, "chats"), storyData);

      navigation.navigate("ChatScreen", {
        chatId: docRef.id,
        topic,
        title,
        aiAssistant,
        wordLimit: wordLimit.toString(),
        numberOfPages,
      });
    } catch (error) {
      console.error("Error creating chat:", error);
      Alert.alert("Error", "Failed to create story. Please try again.");
    }
  };

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[chatListStyles.chatItem, storyRoomsStyles.roomItem]}
      onPress={() => navigation.navigate("ChatScreen", { chatId: item.id })}
    >
      <View style={chatListStyles.chatHeader}>
        <Text style={[chatListStyles.chatUser, storyRoomsStyles.roomTitle]}>
          {item.title || "Untitled Story"}
        </Text>
        {item.isFinished && (
          <View style={chatListStyles.completionTag}>
            <Text style={chatListStyles.completionTagText}>Completed</Text>
          </View>
        )}
      </View>
      {item.topic && (
        <Text style={[chatListStyles.topic, storyRoomsStyles.roomDescription]}>
          {item.topic}
        </Text>
      )}
      <Text
        style={[chatListStyles.lastMessage, storyRoomsStyles.roomMetaText]}
        numberOfLines={2}
      >
        {item.lastMessage || "Start writing your story..."}
      </Text>
    </TouchableOpacity>
  );

  return (
    <PageLayout currentTab="Story Rooms">
      <View style={[headerStyles.header, storyRoomsStyles.header]}>
        <Text style={[headerStyles.title, storyRoomsStyles.headerTitle]}>
          Story Rooms
        </Text>
      </View>
      <View style={[chatListStyles.container, storyRoomsStyles.container]}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={{ flexGrow: 1 }}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("New Story", { onCreateChat: handleCreateChat })
          }
          style={[chatListStyles.newChatButton, storyRoomsStyles.createButton]}
        >
          <Ionicons
            name="add"
            size={20}
            color="#fff"
            style={{ marginRight: 4 }}
          />
          <Text
            style={[chatListStyles.buttonText, storyRoomsStyles.buttonText]}
          >
            New Story
          </Text>
        </TouchableOpacity>
      </View>
    </PageLayout>
  );
};

export default ChatListScreen;

/*
    setup with navigator
<Stack.Screen name="ChatListScreen" component={ChatListScreen} />
<Stack.Screen name="ChatScreen" component={ChatScreen} />

navigation.navigate('ChatListScreen')
*/
