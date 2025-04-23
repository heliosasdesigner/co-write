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
  ScrollView,
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
import React, { useEffect, useState, useRef, useMemo } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { chatWithLLM } from "../../LLMs/config";
import { generateImage } from "../../LLMs/imageGenerator";
import { useImageRequest } from "../hooks/useImageRequest";
import { uploadSectionImages, fetchSectionImages } from "../api/stories";
import { useOpenAIStream } from "../hooks/useOpenAIStream";
import OpenAI from "openai";

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

type BaseMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// For OpenAI API calls
type AIMessage = OpenAI.ChatCompletionMessageParam;

// For streaming
type Prompt = BaseMessage;

const convertToBaseMessage = (msg: AIMessage): BaseMessage => {
  return {
    role:
      msg.role === "system" || msg.role === "user" || msg.role === "assistant"
        ? msg.role
        : "user",
    content: typeof msg.content === "string" ? msg.content : "",
  };
};

const ChatScreen = () => {
  const { chatId, aiAssistant: initialAiAssistant = true } =
    useRoute<ChatScreenRouteProp>().params;
  const [aiAssistant, setAiAssistant] = useState(initialAiAssistant);
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
  const {
    isStreaming,
    error: streamError,
    streamedText,
    startStream,
  } = useOpenAIStream();

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
    if (storySubmit) return;

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

  useEffect(() => {
    // Check if there are no messages or if AI summary is not found
    const hasAISummary = messages.some((msg) => msg.senderId === "AI-summary");
    if (messages.length === 0 || !hasAISummary) {
      setStorySummary("");
      setStorySubmit(false);
    }
  }, [messages]);

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
    const promptHint = `I'm writing a story but I'm stuck for ideas. Here's my current draft:\n\n${composerText}, in no more than 20 words.`;

    try {
      console.log("Attempting to get hint using chatWithLLM...");
      const aiMessages: AIMessage[] = [
        {
          role: "system",
          content:
            "You are the best storyteller in the world. Give a short hint to help continue the story in no more than 20 words.",
        },
        {
          role: "user",
          content: promptHint,
        },
      ];

      try {
        // First try with OpenRouter
        const ai = await chatWithLLM(aiMessages, false);
        console.log("Successfully got hint from OpenRouter");
        setHintText(ai);
        setShowHint(true);
      } catch (openRouterError) {
        console.log(
          "OpenRouter failed, falling back to OpenAI...",
          openRouterError
        );
        try {
          // If OpenRouter fails, try with OpenAI
          const ai = await chatWithLLM(aiMessages, true);
          console.log("Successfully got hint from OpenAI");
          setHintText(ai);
          setShowHint(true);
        } catch (openAIError) {
          console.log(
            "OpenAI failed, attempting streaming fallback...",
            openAIError
          );
          // If both fail, try streaming as last resort
          const streamMessages = aiMessages.map(convertToBaseMessage);
          await startStream(streamMessages);
          if (!streamedText) {
            throw new Error("No response received from any AI service");
          }
          console.log("Successfully got streamed response");
          setHintText(streamedText);
          setShowHint(true);
        }
      }
    } catch (e: any) {
      console.error("All AI services failed:", e);
      Alert.alert(
        "AI Hint Error",
        `Unable to generate hint. Please try again. ${
          e.message || "Unknown error"
        }`
      );
    } finally {
      setLoadingHint(false);
    }
  };

  const handleSubmitStory = async () => {
    // Check if story has enough messages (at least 4)
    const messageCount = messages.filter(
      (m) => m.senderId !== "AI-summary"
    ).length;
    if (messageCount < 4) {
      Alert.alert(
        "Story too short",
        "Please write at least 2 turns (4 messages) before submitting."
      );
      return;
    }

    // Check if story is already submitted
    if (storySubmit) {
      Alert.alert(
        "Story already submitted",
        "This story has already been submitted."
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
        })) as AIMessage[];

      const payload: AIMessage[] = [
        {
          role: "system",
          content:
            "You are the best storyteller in the world. Summarize the story based on the conversation history within 200 words.",
        },
        ...history,
      ];

      let aiText: string;
      try {
        // First try with OpenRouter
        console.log("Attempting to get summary using OpenRouter...");
        aiText = await chatWithLLM(payload, false);
      } catch (openRouterError) {
        console.log(
          "OpenRouter failed, falling back to OpenAI...",
          openRouterError
        );
        // If OpenRouter fails, try with OpenAI
        aiText = await chatWithLLM(payload, true);
      }

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

    const userMessage = input.trim();
    setInput("");

    // Send user's message
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: userMessage,
        senderId: user.uid,
        timestamp: serverTimestamp(),
      });
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: userMessage,
        lastMessageTimestamp: serverTimestamp(),
      });
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err: any) {
      console.error("Error sending message:", err);
      Alert.alert("Error", "Failed to send message. Please try again.");
      return;
    }

    // Generate AI response
    if (aiAssistant) {
      setGenerating(true);
      try {
        console.log("Preparing AI response...");
        const history = messages
          .filter((m) => !!m.text)
          .map((m) => ({
            role: m.senderId === user?.uid ? "user" : "assistant",
            content: m.text!,
          })) as AIMessage[];

        const payload: AIMessage[] = [
          {
            role: "system",
            content:
              "You are the best storyteller in the world. Continue writing a story based on the user's input within 20 words.",
          },
          ...history,
          { role: "user", content: userMessage },
        ];

        let aiText: string;
        try {
          // First try with OpenRouter
          console.log("Attempting to get response using OpenRouter...");
          aiText = await chatWithLLM(payload, false);
          console.log("Successfully got response from OpenRouter");
        } catch (openRouterError) {
          console.log(
            "OpenRouter failed, falling back to OpenAI...",
            openRouterError
          );
          try {
            // If OpenRouter fails, try with OpenAI
            aiText = await chatWithLLM(payload, true);
            console.log("Successfully got response from OpenAI");
          } catch (openAIError) {
            console.log(
              "OpenAI failed, attempting streaming fallback...",
              openAIError
            );
            // If both fail, try streaming as last resort
            const streamMessages = payload.map(convertToBaseMessage);
            await startStream(streamMessages);
            if (!streamedText) {
              throw new Error("No response received from any AI service");
            }
            console.log("Successfully got streamed response");
            aiText = streamedText;
          }
        }

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
            setImagePrompt(storyText);
          } catch (imgErr: any) {
            console.error("Image generation failed:", imgErr);
            Alert.alert(
              "Image Generation Error",
              "Failed to generate image. The story will continue without an image."
            );
          }
        }
      } catch (e: any) {
        console.error("All AI services failed:", e);
        Alert.alert(
          "AI Response Error",
          `Failed to get AI response. Please try again. ${
            e.message || "Unknown error"
          }`
        );
      } finally {
        setGenerating(false);
        setImageGenerating(false);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {aiAssistant && !storySubmit && (
        <>
          <View style={styles.hintButtonContainer}>
            <Button
              title={generating ? "Generating..." : "Submit the story"}
              onPress={handleSubmitStory}
              disabled={
                generating ||
                imageGenerating ||
                isLoading ||
                messages.filter((m) => m.senderId !== "AI-summary").length <
                  4 ||
                storySubmit
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

      {storySubmit ? (
        // Story Completion View
        <ScrollView style={styles.completionContainer}>
          <View style={styles.completionContent}>
            <Text style={styles.completionTitle}>Story Complete!</Text>

            {/* Story Summary */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Story Summary</Text>
              <Text style={styles.summaryText}>{storySummary}</Text>
            </View>

            {/* Story Image */}
            {imageUrl && (
              <View style={styles.imageContainer}>
                <Text style={styles.imageTitle}>Story Illustration</Text>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.completionImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Loading States */}
            {(imageGenerating || isLoading) && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Generating image...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Error generating image: {error.toString()}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        // Chat Interface
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
                {item.text && (
                  <Text style={styles.messageText}>{item.text}</Text>
                )}
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

          {aiAssistant && !storySubmit && (
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
              editable={!storySubmit}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={overLimit || overPageLimit || storySubmit}
              style={[
                styles.sendButton,
                (overLimit || overPageLimit || storySubmit) && {
                  backgroundColor: "#ccc",
                },
              ]}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
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
  completionContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  completionContent: {
    padding: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007bff",
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  completionImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
  },
});
