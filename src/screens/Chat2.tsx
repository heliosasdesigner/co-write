import {
  Alert,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  Switch,
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
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { chatWithLLM } from "../../LLMs/config";
import { generateImage } from "../../LLMs/imageGenerator";
import { useImageRequest } from "../hooks/useImageRequest";
import { uploadSectionImages, fetchSectionImages } from "../api/stories";
import { useOpenAIStream } from "../hooks/useOpenAIStream";
import OpenAI from "openai";
import { chatStyles } from "../styles";

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
  const navigation = useNavigation();
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
      .then(async (url) => {
        console.log("Image was uploaded successfully: ", url);
        // Update the story's finished status when both image and summary exist
        if (url && storySummary) {
          try {
            await updateDoc(doc(db, "chats", chatId), {
              isFinished: true,
              finishedAt: serverTimestamp(),
            });
            console.log("Story marked as finished in database");
          } catch (error) {
            console.error("Error updating story finished status:", error);
          }
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }, [imageUrl, storySummary]);

  useEffect(() => {
    // Check if there are no messages or if AI summary is not found
    const hasAISummary = messages.some((msg) => msg.senderId === "AI-summary");
    if (messages.length === 0 || !hasAISummary) {
      setStorySummary("");
      setStorySubmit(false);
      // Reset finished status if summary is removed
      updateDoc(doc(db, "chats", chatId), {
        isFinished: false,
        finishedAt: null,
      }).catch((error) => {
        console.error("Error resetting story finished status:", error);
      });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={chatStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={chatStyles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
          <Text style={chatStyles.backButtonText}>Story Rooms</Text>
        </TouchableOpacity>
        <Text style={chatStyles.headerTitle}>Story</Text>
      </View>

      <View style={{ flex: 1 }}>
        {aiAssistant && !storySubmit && (
          <>
            <View style={chatStyles.hintButtonContainer}>
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
              <View style={chatStyles.hintButtonContainer}>
                <ActivityIndicator size="small" />
                <Text style={{ textAlign: "center" }}>Generating image…</Text>
              </View>
            )}
            {error && (
              <View style={chatStyles.hintButtonContainer}>
                <Text style={{ color: "red", textAlign: "center" }}>
                  Error generating image: {error.toString()}
                </Text>
              </View>
            )}
          </>
        )}

        {storySubmit ? (
          <ScrollView style={chatStyles.completionContainer}>
            <View style={chatStyles.completionContent}>
              <Text style={chatStyles.completionTitle}>Story Complete!</Text>

              {imageUrl && (
                <View style={chatStyles.imageContainer}>
                  <Text style={chatStyles.imageTitle}>Story Illustration</Text>
                  <Image
                    source={{ uri: imageUrl }}
                    style={chatStyles.completionImage}
                    resizeMode="contain"
                  />
                </View>
              )}

              <View style={chatStyles.summaryContainer}>
                <Text style={chatStyles.summaryTitle}>Story Summary</Text>
                <Text style={chatStyles.summaryText}>{storySummary}</Text>
              </View>

              {(imageGenerating || isLoading) && (
                <View style={chatStyles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007bff" />
                  <Text style={chatStyles.loadingText}>
                    Generating image...
                  </Text>
                </View>
              )}

              {error && (
                <View style={chatStyles.errorContainer}>
                  <Text style={chatStyles.errorText}>
                    Error generating image: {error.toString()}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <KeyboardAvoidingView
            style={chatStyles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
          >
            <FlatList
              data={messages.filter((msg) => msg.senderId !== "AI-summary")}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const messageList = messages.filter(
                  (msg: Message) => msg.senderId !== "AI-summary"
                );
                const isFirstInGroup =
                  index === 0 ||
                  messageList[index - 1].senderId !== item.senderId;

                if (isFirstInGroup) {
                  return (
                    <View
                      style={[
                        chatStyles.messageGroup,
                        item.senderId === user?.uid &&
                          chatStyles.myMessageGroup,
                      ]}
                    >
                      <View
                        style={[
                          chatStyles.messageBubble,
                          item.senderId === user?.uid
                            ? chatStyles.myMessage
                            : chatStyles.theirMessage,
                        ]}
                      >
                        {item.imageUrl && (
                          <Image
                            source={{ uri: item.imageUrl }}
                            style={chatStyles.messageImage}
                          />
                        )}
                        {item.text && (
                          <Text
                            style={[
                              chatStyles.messageText,
                              item.senderId === user?.uid
                                ? chatStyles.myMessageText
                                : chatStyles.theirMessageText,
                            ]}
                          >
                            {item.text}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                }

                return (
                  <View
                    style={[
                      chatStyles.messageBubble,
                      item.senderId === user?.uid
                        ? chatStyles.myMessage
                        : chatStyles.theirMessage,
                    ]}
                  >
                    {item.imageUrl && (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={chatStyles.messageImage}
                      />
                    )}
                    {item.text && (
                      <Text
                        style={[
                          chatStyles.messageText,
                          item.senderId === user?.uid
                            ? chatStyles.myMessageText
                            : chatStyles.theirMessageText,
                        ]}
                      >
                        {item.text}
                      </Text>
                    )}
                  </View>
                );
              }}
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
              <View style={chatStyles.hintBox}>
                <Text style={chatStyles.hintText}>{hintText}</Text>
              </View>
            )}

            {aiAssistant && !storySubmit && (
              <View style={chatStyles.hintButtonContainer}>
                {loadingHint ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Button
                    title={showHint ? "Hide AI Hint" : "Get AI Hint"}
                    onPress={() =>
                      showHint ? setShowHint(false) : handleHint()
                    }
                  />
                )}
              </View>
            )}

            <View style={chatStyles.inputContainer}>
              <TextInput
                placeholder="Write your turn..."
                value={input}
                onChangeText={(t) => {
                  setInput(t);
                  setComposerText(t);
                }}
                style={chatStyles.input}
                multiline
                editable={!storySubmit}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={overLimit || overPageLimit || storySubmit}
                style={[
                  chatStyles.sendButton,
                  (overLimit || overPageLimit || storySubmit) && {
                    backgroundColor: "#ccc",
                  },
                ]}
              >
                <Text style={chatStyles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
