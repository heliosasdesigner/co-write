import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import React, { useEffect, useState, useRef } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  ChatScreen: { chatId: string };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
};

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [wordLimit, setWordLimit] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchChatSettings = async () => {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        const data = chatSnap.data();
        if (data.wordLimit) setWordLimit(data.wordLimit);
      }
    };
    fetchChatSettings();
  }, [chatId]);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Message)
      );
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const overLimit = wordLimit !== null && wordCount > wordLimit;

  const handleSend = async () => {
    if (!input.trim() || !user || overLimit) return;

    const messageData = {
      text: input.trim(),
      senderId: user.uid,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "chats", chatId, "messages"), messageData);
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: input.trim(),
      lastMessageTimestamp: serverTimestamp(),
    });

    setInput("");
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.senderId === user?.uid
                ? styles.myMessage
                : styles.theirMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        ref={flatListRef}
        contentContainerStyle={{ paddingVertical: 12 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {wordLimit !== null && (
        <Text
          style={{
            textAlign: "right",
            marginRight: 10,
            color: overLimit ? "red" : "gray",
          }}
        >
          {wordCount}/{wordLimit} words
        </Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Write your turn..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, overLimit && { backgroundColor: "#ccc" }]}
          disabled={overLimit}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  sendText: {
    color: "white",
    fontWeight: "bold",
  },
  messageBubble: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    maxWidth: "70%",
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
});
