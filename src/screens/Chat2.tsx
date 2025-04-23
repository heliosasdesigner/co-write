import {
  Alert,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  collection,
  query,
  orderBy,
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
import { chatWithLLM } from "../../LLMs/config";

type RootStackParamList = {
  ChatScreen: { chatId: string; aiAssistant?: boolean };
};
type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
};

const ChatScreen = () => {
  const { chatId, aiAssistant = true } = useRoute<ChatScreenRouteProp>().params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [wordLimit, setWordLimit] = useState<number | null>(null);
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [composerText, setComposerText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [generating, setGenerating] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const user = auth.currentUser;

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "chats", chatId));
      if (snap.exists()) {
        const d = snap.data();
        if (d.wordLimit) setWordLimit(d.wordLimit);
        if (d.numberOfPages) setNumberOfPages(d.numberOfPages);
        if (typeof d.aiAssistant === "boolean") {
          setAiAssistant(d.aiAssistant);
        }
      }
    })();
  }, [chatId]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      ),
      (snap) =>
        setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })))
    );
    return () => unsub();
  }, [chatId]);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const overLimit = wordLimit != null && wordCount > wordLimit;
  const pageCount = messages.length;
  const overPageLimit = numberOfPages != null && pageCount > numberOfPages;

  const handleHint = async () => {
    if (!composerText.trim()) {
      setHintText(
        "Please type a bit of your story first, and then I can help you brainstorm!"
      );
      return setShowHint(true);
    }
    setLoadingHint(true);
    try {
      const promptHint =
        `I'm writing a story but I'm stuck for ideas. ` +
        `Here's my current draft:\n\n${composerText}`;

      const ai = await chatWithLLM([{ role: "user", content: promptHint }]);

      setHintText(ai);
      setShowHint(true);
    } catch (e: any) {
      Alert.alert("AI Hint Error", e.message);
    } finally {
      setLoadingHint(false);
    }
  };

  const handleGenerate = async () => {
    if (!aiAssistant) return;
    setGenerating(true);

    try {
      const history = messages.map((m) => ({
        role: m.senderId === user?.uid ? "user" : "assistant",
        content: m.text,
      }));

      const payload = [
        { role: "system", content: "You are a helpful story assistant." },
        ...history,
        {
          role: "user",
          content: `Continue as page ${
            pageCount + 1
          } of ${numberOfPages}, in no more than ${wordLimit} words.`,
        },
      ];

      const aiText = await chatWithLLM(payload);

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: aiText.trim(),
        senderId: "AI",
        timestamp: serverTimestamp(),
      });
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (e: any) {
      Alert.alert("AI Generate Error", e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user || overLimit || overPageLimit) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: input.trim(),
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: input.trim(),
      lastMessageTimestamp: serverTimestamp(),
    });
    setInput("");
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={{ flex: 1 }}>
      {aiAssistant && (
        <>
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

          <View style={styles.hintButtonContainer}>
            <Button
              title={generating ? "Generating..." : "Continue with AI"}
              onPress={handleGenerate}
              disabled={generating}
            />
          </View>
        </>
      )}

      {showHint && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>{hintText}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messages}
          keyExtractor={(i) => i.id}
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

        {wordLimit != null && (
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
        {numberOfPages != null && (
          <Text
            style={{
              textAlign: "right",
              marginRight: 10,
              color: overPageLimit ? "red" : "gray",
            }}
          >
            {pageCount}/{numberOfPages} pages
          </Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Write your turn..."
            value={input}
            onChangeText={(t) => {
              setInput(t);
              setComposerText(t);
            }}
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={overLimit || overPageLimit}
            style={[
              styles.sendButton,
              (overLimit || overPageLimit) && { backgroundColor: "#ccc" },
            ]}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
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
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 100,
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
