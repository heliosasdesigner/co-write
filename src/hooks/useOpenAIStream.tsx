/**
 * OpenAI Streaming Component
 *
 * This component demonstrates how to implement streaming responses from the OpenAI API
 * using the react-native-openai package. It provides a simple interface to send prompts
 * and receive real-time streaming responses.
 *
 * TODO: Refactor this into a custom hook (useOpenAIStream) to make the streaming
 * functionality reusable across components and improve code organization.
 */

import OpenAI from "react-native-openai";
import { useCallback, useEffect, useMemo, useState } from "react";
import Constants from "expo-constants";

interface Prompt {
  role: "system" | "user" | "assistant";
  content: string;
}

// Get OpenAI API key from Expo config
const { OPENAI_API_KEY } = Constants.expoConfig?.extra || {};

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

export function useOpenAIStream() {
  // Initialize OpenAI client with API key
  const openAI = useMemo(
    () => new OpenAI({ apiKey: OPENAI_API_KEY, organization: "" }),
    []
  );

  // State for managing streaming response and input prompt
  const [streamedText, setStreamedText] = useState("");

  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Set up event listener for streaming responses
  useEffect(() => {
    console.log("openAI api streaming response starting...");
    const handleMessage = (payload: any) => {
      // Extract new token from the streaming response
      const newToken = payload.choices?.[0]?.delta?.content;
      if (newToken) {
        // Append the new token to the existing text
        setStreamedText((prev) => prev + newToken);
      }

      // Log when the stream ends, ending Flag is here
      if (payload.choices?.[0]?.finishReason) {
        console.log(
          "Stream ended, finishReason:",
          payload.choices[0].finishReason
        );
        setIsStreaming(false);
      }
    };

    // Attach the listener for chat messages
    openAI.chat.addListener("onChatMessageReceived", handleMessage);

    // Cleanup: remove listener on component unmount
    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI]);

  // Function to initiate streaming request
  const startStream = useCallback(
    async (prompts: Prompt[]) => {
      setStreamedText("");
      setError(null);
      setIsStreaming(true);

      try {
        openAI.chat.stream({
          // example of prompts:
          // [
          //   {
          //     role: "system",
          //     content: "You are the best storyteller in the world. Continue writing a story base on user's input within 100 words",
          //   },
          //   {
          //     role: "user",
          //     content: "new prompt here",
          //   },
          // ],
          model: "gpt-4o-mini",
          messages: prompts,
        });
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsStreaming(false);
      }
    },
    [openAI]
  );

  return { isStreaming, error, streamedText, startStream };
}
