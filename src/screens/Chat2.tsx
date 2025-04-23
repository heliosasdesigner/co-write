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
  Image,
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
import { generateImage } from "../../LLMs/imageGenerator";
import { useImageRequest } from "../hooks/useImageRequest";
import { uploadSectionImages } from "../../api/stories";

type RootStackParamList = {
  ChatScreen: { chatId: string; aiAssistant?: boolean };
};
type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

type Message = {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  timestamp: any;
};

const ChatScreen = () => {
  const { chatId, aiAssistant = true } = useRoute<ChatScreenRouteProp>().params;
  const { imageUrl, isLoading, error, setImagePrompt } = useImageRequest();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [wordLimit, setWordLimit] = useState<number | null>(null);
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [composerText, setComposerText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [storySubmit, setStorySubmit] = useState(false);
  const [storySummary, setStorySummary] = useState("");
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

  useEffect(() => {
    if (!imageUrl) return;

    console.log("handleImageUpload hit!!!");
    console.log(imageUrl);

    uploadSectionImages(imageUrl, chatId)
      .then((url) => {
        console.log("Image was uploaded successfully: ", url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }, [imageUrl]);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const overLimit = wordLimit != null && wordCount > wordLimit;
  const textPages = messages.filter((m) => !!m.text).length;
  const overPageLimit = numberOfPages != null && textPages >= numberOfPages;

  const handleHint = async () => {
    if (!composerText.trim()) {
      setHintText(
        "Please type a bit of your story first, and then I can help you brainstorm!"
      );
      return setShowHint(true);
    }
    setLoadingHint(true);
    try {
      const promptHint = `I'm writing a story but I'm stuck for ideas. Here's my current draft:\n\n${composerText}, in no more than 20 words.`;
      const ai = await chatWithLLM([{ role: "user", content: promptHint }]);
      setHintText(ai);
      setShowHint(true);
    } catch (e: any) {
      Alert.alert("AI Hint Error", e.message);
    } finally {
      setLoadingHint(false);
    }
  };

  const handleSubmitStory = async () => {
    // Check if story is not complete yet
    if (!aiAssistant || !numberOfPages || textPages + 1 < numberOfPages) {
      Alert.alert(
        "Story not complete",
        "Please complete all pages before submitting."
      );
      return;
    }

    setGenerating(true);
    try {
      const history = messages
        .filter((m) => !!m.text && m.senderId !== "AI-summary")
        .map((m) => ({
          role: m.senderId === user?.uid ? "user" : "assistant",
          content: m.text!,
        }));

      const payload = [
        {
          role: "system",
          content:
            "You are the best storyteller in the world. Summarize the story based on the conversation history within 200 words.",
        },
        ...history,
      ];

      const aiText = await chatWithLLM(payload);

      // Update story summary state
      setStorySummary(aiText.trim());
      // Mark story as submitted
      setStorySubmit(true);

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: aiText.trim(),
        senderId: "AI-summary",
        timestamp: serverTimestamp(),
      });
      flatListRef.current?.scrollToEnd({ animated: true });

      // Generate image for the completed story
      setImageGenerating(true);
      try {
        const storyText = [
          ...history.map((h) => `${h.role}: ${h.content}`),
          `AI: ${aiText.trim()}`,
        ].join("\n\n");

        console.log("storyText", storyText);
        setImagePrompt(storyText);
      } catch (imgErr: any) {
        console.warn("Image generation failed:", imgErr);
      }
    } catch (e: any) {
      Alert.alert("AI Generate Error", e.message);
      // Reset states in case of error
      setStorySubmit(false);
      setStorySummary("");
    } finally {
      setGenerating(false);
      setImageGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user || overLimit || overPageLimit) return;

    // Send user's message
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

    // Generate AI response
    if (aiAssistant) {
      setGenerating(true);
      try {
        const history = messages
          .filter((m) => !!m.text)
          .map((m) => ({
            role: m.senderId === user?.uid ? "user" : "assistant",
            content: m.text!,
          }));

        const payload = [
          {
            role: "system",
            content:
              "You are the best storyteller in the world. Continue writing a story based on the user's input within 20 words.",
          },
          ...history,
          { role: "user", content: input.trim() },
        ];

        const aiText = await chatWithLLM(payload);

        // Store AI response in database
        await addDoc(collection(db, "chats", chatId, "messages"), {
          text: aiText.trim(),
          senderId: "AI",
          timestamp: serverTimestamp(),
        });
        flatListRef.current?.scrollToEnd({ animated: true });

        // Generate image if it's the last page
        if (numberOfPages != null && textPages + 1 >= numberOfPages) {
          setImageGenerating(true);
          try {
            const storyText = [
              ...history.map((h) => `${h.role}: ${h.content}`),
              `AI: ${aiText.trim()}`,
            ].join("\n\n");
            const generatedUrl = await generateImage(storyText);
            if (generatedUrl) {
              await addDoc(collection(db, "chats", chatId, "messages"), {
                imageUrl: generatedUrl,
                senderId: "AI",
                timestamp: serverTimestamp(),
              });
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          } catch (imgErr: any) {
            console.warn("Image generation failed:", imgErr);
          }
        }
      } catch (e: any) {
        Alert.alert("AI Response Error", e.message);
      } finally {
        setGenerating(false);
        setImageGenerating(false);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {aiAssistant && (
        <>
          <View style={styles.hintButtonContainer}>
            <Button
              title={generating ? "Generating..." : "Submit the story"}
              onPress={handleSubmitStory}
              disabled={
                generating ||
                imageGenerating ||
                isLoading ||
                !numberOfPages ||
                textPages + 1 < numberOfPages
              }
            />
          </View>
          {(imageGenerating || isLoading) && (
            <View style={styles.hintButtonContainer}>
              <ActivityIndicator size="small" />
              <Text style={{ textAlign: "center" }}>Generating image…</Text>
            </View>
          )}
          {error && (
            <View style={styles.hintButtonContainer}>
              <Text style={{ color: "red", textAlign: "center" }}>
                Error generating image: {error.toString()}
              </Text>
            </View>
          )}
        </>
      )}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messages.filter((msg) => msg.senderId !== "AI-summary")}
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
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.messageImage}
                />
              )}
              {item.text && <Text style={styles.messageText}>{item.text}</Text>}
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
            {textPages}/{numberOfPages} pages
          </Text>
        )}

        {showHint && (
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>{hintText}</Text>
          </View>
        )}

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
              (overLimit || overPageLimit) && {
                backgroundColor: "#ccc",
              },
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
    alignItems: "flex-start",
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
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
});
