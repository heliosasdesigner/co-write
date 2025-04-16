import React, { useState, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
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
  }, [topic, aiAssistant, wordLimit]);

  const onSend = (newMessages = []) => {
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
