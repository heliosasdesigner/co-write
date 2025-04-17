import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import type { ChatsFlowParamList } from "../navigation/ChatsFlowStack";
import { chatWithLLM } from "../../LLMs/config";

type ChatScreenRouteProp = RouteProp<ChatsFlowParamList, "ChatConversation">;

export default function Chats() {
  const route = useRoute<ChatScreenRouteProp>();
  const {
    topic = "Untitled",
    aiAssistant = false,
    wordLimit = "100",
    numberOfPages = "6",
  } = route.params || {};

  const [messages, setMessages] = useState<any[]>([]);
  const [composerText, setComposerText] = useState("");

  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text:
          `Welcome to a story about "${topic}".\n` +
          `AI: ${aiAssistant}\n` +
          `Word Limit: ${wordLimit}\n` +
          `Pages: ${numberOfPages}`,
        createdAt: new Date(),
        user: { _id: 2, name: "System" },
      },
    ]);
  }, [topic, aiAssistant, wordLimit, numberOfPages]);

  const onSend = (newMessages: any[] = []) => {
    const pagesAllowed = parseInt(numberOfPages, 10);
    const userPages = messages.filter((m) => m.user._id === 1).length;
    if (userPages >= pagesAllowed) {
      Alert.alert(
        "Page limit reached",
        `You’ve already used all ${pagesAllowed} pages of the story.`
      );
      return;
    }

    const limitNum = parseInt(wordLimit, 10);
    const incomingText = newMessages[0]?.text?.trim() || "";
    const wordCount = incomingText.split(/\s+/).filter(Boolean).length;
    if (wordCount > limitNum) {
      Alert.alert(
        "Word limit exceeded",
        `Your message is ${wordCount} words; limit is ${limitNum}.`
      );
      return;
    }

    setMessages((prev) => GiftedChat.append(prev, newMessages));
    setComposerText("");
  };

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
        `I’m writing a story but I’m stuck for ideas. ` +
        `Here’s my current draft:\n\n${composerText}`;
      const aiResponse = await chatWithLLM(promptHint);
      setHintText(aiResponse);
      setShowHint(true);
    } catch (err: any) {
      Alert.alert("AI Hint Error", err.message);
    } finally {
      setLoadingHint(false);
    }
  };

  const limitNum = parseInt(wordLimit, 10);
  const wordsUsed = composerText.trim().split(/\s+/).filter(Boolean).length;
  const remaining = Math.max(limitNum - wordsUsed, 0);

  return (
    <View style={styles.container}>
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

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1, name: "You" }}
        text={composerText}
        onInputTextChanged={(text) => {
          const words = text.trim().split(/\s+/).filter(Boolean).length;
          if (words <= limitNum) {
            setComposerText(text);
          }
        }}
        renderAccessory={() => (
          <View style={styles.accessory}>
            <Text style={styles.counter}>{remaining} words remaining</Text>
          </View>
        )}
      />
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
});
