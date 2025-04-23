import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import PageLayout from "../components/PageLayout";
import { chatListStyles } from "../styles";

import NewChatModal from "./Chat2NewChat";

type RootStackParamList = {
  ChatScreen: { chatId: string };
  ChatList: undefined;
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
};

const ChatListScreen = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [showModal, setShowModal] = useState(false);
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
    if (!user) return;

    const participants = [user?.uid, otherUserId].sort();
    const chatId = `${participants.join("_")}_${Date.now()}`;

    const chatRef = doc(db, "chats", chatId);

    await setDoc(chatRef, {
      participants,
      aiAssistant,
      title,
      topic,
      wordLimit,
      numberOfPages: numberOfPages ? parseInt(numberOfPages) : null,
      lastMessage: "",
      lastMessageTimestamp: serverTimestamp(),
    });

    navigation.navigate("ChatScreen", { chatId });
  };

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={chatListStyles.chatItem}
      onPress={() => navigation.navigate("ChatScreen", { chatId: item.id })}
    >
      <Text style={chatListStyles.chatUser}>{item.otherUser}</Text>
      {item.topic && (
        <Text style={chatListStyles.topic}>Topic: {item.topic}</Text>
      )}
      <Text style={chatListStyles.lastMessage} numberOfLines={1}>
        {item.lastMessage || "Start the story..."}
      </Text>
    </TouchableOpacity>
  );

  return (
    <PageLayout currentTab="Story Rooms">
      <View style={chatListStyles.container}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={chatListStyles.newChatButton}
        >
          <Text style={chatListStyles.buttonText}>+ New Chat</Text>
        </TouchableOpacity>

        <NewChatModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onCreateChat={handleCreateChat}
        />
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
