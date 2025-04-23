import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { chatWithLLM } from "../../LLMs/config";
import {
  query,
  orderBy,
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { getStoryChats, addChatMessage, ChatMessage } from "../../api/stories";
import { chatStyles, pageLayoutStyles } from "../styles";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

const formatTimestamp = (timestamp: Timestamp | Date) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp.toLocaleString();
};

export default function Chats() {
  const route = useRoute<ChatScreenRouteProp>();
  const { roomId: storyId } = route.params;

  // Early return if no storyId
  if (!storyId) {
    return (
      <View style={pageLayoutStyles.container}>
        <Text>Error: No story ID provided</Text>
      </View>
    );
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const [composerText, setComposerText] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getStoryChats(storyId);
        setMessages(chats);
        setComposerText("");
      } catch (error) {
        console.error("Error fetching chats:", error);
        Alert.alert("Error", "Failed to load chat messages");
      }
    };

    fetchChats();

    // Set up real-time listener
    const chatCollectionRef = collection(db, `stories/${storyId}/chats`);
    const q = query(chatCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (!data.text || !data.user || !data.createdAt) {
            console.warn("Invalid message skipped:", doc.id, data);
            return null;
          }

          return {
            id: doc.id,
            text: data.text,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            user: data.user,
          };
        })
        .filter(Boolean) as ChatMessage[];

      setMessages(loadedMessages);
      setComposerText("");
    });

    return () => unsubscribe();
  }, [storyId]);

  const handleHint = async () => {
    if (!composerText.trim()) {
      setHintText(
        "Please type a bit of your story first, and then I can help you brainstorm!"
      );
      setShowHint(true);
      return;
    }
    setLoadingHint(true);
    try {
      const promptHint =
        `I'm writing a story but I'm stuck for ideas. ` +
        `Here's my current draft:\n\n${composerText}`;
      const aiResponse = await chatWithLLM(promptHint);
      setHintText(aiResponse);
      setShowHint(true);
    } catch (error: unknown) {
      Alert.alert(
        "AI Hint Error",
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setLoadingHint(false);
    }
  };

  const handleSend = async () => {
    const currentUser = auth.currentUser;
    if (!storyId) {
      Alert.alert("Error", "No story ID provided");
      return;
    }

    if (!currentUser?.email) {
      Alert.alert("Error", "You must be logged in to send messages");
      return;
    }

    if (!input.trim()) return;

    const newMessage = {
      text: input.trim(),
      user: { _id: currentUser.email },
    };

    try {
      await addChatMessage(storyId, newMessage);
      setInput("");
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  return (
    <View style={chatStyles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              chatStyles.messageBubble,
              item.user._id === auth.currentUser?.email
                ? chatStyles.myMessage
                : chatStyles.theirMessage,
            ]}
          >
            <Text style={chatStyles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={chatStyles.inputContainer}>
          <TextInput
            style={chatStyles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity style={chatStyles.sendButton} onPress={handleSend}>
            <Text style={chatStyles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
