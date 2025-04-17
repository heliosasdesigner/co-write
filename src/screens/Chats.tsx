import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { Alert } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import type { ChatsFlowParamList } from "../navigation/ChatsFlowStack";

type ChatScreenRouteProp = RouteProp<ChatsFlowParamList, "ChatConversation">;

export default function Chats() {
  const route = useRoute<ChatScreenRouteProp>();
  const {
    topic = "Untitled",
    aiAssistant = false,
    wordLimit = "100",
    numberOfPages = "6",
  } = route.params || {};

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Welcome to a story about "${topic}".\nAI: ${aiAssistant}\nWord Limit: ${wordLimit}\nPages: ${numberOfPages}`,
        createdAt: new Date(),
        user: { _id: 2, name: "System" },
      },
    ]);
  }, [topic, aiAssistant, wordLimit, numberOfPages]);

  const onSend = (newMessages = []) => {
    const pagesAllowed = parseInt(numberOfPages, 10);
    const userPages = messages.filter((m) => m.user._id === 1).length;
    if (userPages >= pagesAllowed) {
      Alert.alert(
        "Page limit reached",
        `You’ve already used all ${pagesAllowed} pages of the story.`
      );
      return;
    }

    const limit = parseInt(wordLimit, 10);
    const incomingText = newMessages[0]?.text?.trim() || "";
    const wordCount = incomingText.split(/\s+/).filter(Boolean).length;
    if (wordCount > limit) {
      Alert.alert(
        "Word limit exceeded",
        `Your message is ${wordCount} words; limit is ${limit}.`
      );
      return;
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{ _id: 1, name: "You" }}
    />
  );
}
