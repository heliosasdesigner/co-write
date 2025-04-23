import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
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

import NewChatModal from "./Chat2NewChat";

type RootStackParamList = {
  ChatScreen: { chatId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "ChatScreen">;

type Chat = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: any;
  otherUser: string;
};

const ChatListScreen = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const user = auth.currentUser;
  console.log(user, "<<<< User");
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
          ...data,
          otherUser: data.participants.find((p: string) => p !== user.uid),
        };
      });
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateChat = async (
    otherUserId: string,
    topic: string,
    wordLimit: number
  ) => {
    if (!user) return;

    const participants = [user?.uid, otherUserId].sort();
    const chatId = participants.join("_");

    const chatRef = doc(db, "chats", chatId);

    await setDoc(chatRef, {
      participants,
      topic,
      wordLimit,
      lastMessage: "",
      lastMessageTimestamp: serverTimestamp(),
    });

    navigation.navigate("ChatScreen", { chatId });
  };

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatScreen", { chatId: item.id })}
    >
      <Text style={styles.chatUser}>{item.otherUser}</Text>
      {item.topic && <Text style={styles.topic}>Topic: {item.topic}</Text>}
      <Text style={styles.lastMessage} numberOfLines={1}>
        {item.lastMessage || "Start the story..."}
      </Text>
    </TouchableOpacity>
  );

  return (
    <PageLayout currentTab="Chat List" scrollable>
      <View style={styles.container}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={styles.newChatButton}
        >
          <Text style={styles.buttonText}>+ New Chat</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chatItem: {
    padding: 16,
    backgroundColor: "#f6f6f6",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  chatUser: {
    fontWeight: "600",
    fontSize: 16,
  },
  topic: {
    color: "#555",
    fontStyle: "italic",
  },
  lastMessage: {
    color: "#555",
    marginTop: 4,
  },
  newChatButton: {
    backgroundColor: "#007bff",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

/*
    setup with navigator
<Stack.Screen name="ChatListScreen" component={ChatListScreen} />
<Stack.Screen name="ChatScreen" component={ChatScreen} />

navigation.navigate('ChatListScreen')
*/
