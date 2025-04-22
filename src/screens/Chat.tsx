import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ChatsFlowParamList } from "../navigation/ChatsFlowStack";
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

type ChatScreenRouteProp = RouteProp<ChatsFlowParamList, "Chat">;

const formatTimestamp = (timestamp: Timestamp | Date) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp.toLocaleString();
};

export default function Chats() {
  const route = useRoute<ChatScreenRouteProp>();

  const { storyId } = route.params;

  // Then destructure optional params with defaults
  console.log(route.params);
  const {
    topic = "Untitled",
    aiAssistant = false,
    wordLimit = "100",
    numberOfPages = "6",
  } = route.params;

  // Early return if no storyId (this shouldn't happen due to TypeScript, but good practice)
  if (!storyId) {
    return (
      <View style={styles.container}>
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
  const pagesAllowed = parseInt(numberOfPages, 10);
  const userPages = messages.length - 1;
  const wordLimitInteger = parseInt(wordLimit, 10);
  const [composerText, setComposerText] = useState("");
  const wordsUsed = composerText.trim().split(/\s+/).filter(Boolean).length;
  const remaining = Math.max(wordLimitInteger - wordsUsed, 0);

  const storySettings = {
    text:
      `Welcome to a story about "${topic}".\n` +
      `AI: ${aiAssistant}\n` +
      `Word Limit: ${wordLimit}\n` +
      `Pages: ${numberOfPages}`,
    createdAt: new Date(),
    user: { _id: "System" },
  };

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
    } catch (err: any) {
      Alert.alert("AI Hint Error", err.message);
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

    const newMessage = {
      text: input.trim(),
      user: { _id: currentUser.email },
    };

    if (!input.trim()) return;

    if (userPages >= pagesAllowed) {
      Alert.alert(
        "Page limit reached",
        `You've already used all ${pagesAllowed} pages of the story.`
      );
      return;
    }

    const incomingText = newMessage.text;
    const wordCount = incomingText.split(/\s+/).filter(Boolean).length;
    if (wordCount > wordLimitInteger) {
      Alert.alert(
        "Word limit exceeded",
        `Your page is ${wordCount} words; limit is ${wordLimitInteger}.`
      );
      return;
    }

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
    <View style={(styles.container, { flex: 1 })}>
      {aiAssistant && (
        <View style={styles.hintButtonContainer}>
          {loadingHint ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button
              title={showHint ? "Hide AI Hint" : "Get AI Hint"}
              onPress={() => (showHint ? setShowHint(false) : handleHint())}
            />
          )}
        </View>
      )}

      {showHint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>{hintText}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.messageAuthor}>
                {item.user._id === auth.currentUser?.email
                  ? "You"
                  : item.user._id}
              </Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTimestamp}>
                {formatTimestamp(item.createdAt)}
              </Text>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={true}
        />
        <Text style={styles.counter}>Remaining Words: {remaining}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={(text) => {
              setInput(text);
              const words = text.trim().split(/\s+/).filter(Boolean).length;
              if (words <= wordLimitInteger) {
                setComposerText(text);
              }
            }}
            placeholder="Write your message..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={{ color: "#fff" }}>Send</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            marginTop: 8,
            color: remaining < 0 ? "red" : "black",
          }}
        ></Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hintButtonContainer: {
    padding: 8,
  },
  hintBox: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 8,
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
  },
  hintText: {
    color: "#333",
  },
  accessory: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  counter: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#666",
  },
  messageContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 12,
  },
  messageAuthor: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    fontWeight: "600",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
});
