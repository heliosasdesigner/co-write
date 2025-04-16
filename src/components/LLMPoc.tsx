import OpenAI from "react-native-openai";
import React, { useEffect, useMemo, useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { chatWithLLM } from "../../LLMs/config";
import Constants from "expo-constants";

const { OPENAI_API_KEY, OPENROUTER_API_KEY } =
  Constants.expoConfig?.extra || {};

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined");
}

function LLMPoc() {
  // openAI
  const openAI = useMemo(
    () => new OpenAI({ apiKey: OPENAI_API_KEY, organization: "" }),
    []
  );

  // openrouter
  const openrouter = useMemo(
    () =>
      new OpenAI({
        host: "https://openrouter.ai/api/v1",
        apiKey: OPENROUTER_API_KEY,
        organization: "",
      }),
    []
  );

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  // for streaming
  const [streamedText, setStreamedText] = useState("");
  const [promptForStreaming, setPromptForStreaming] = useState("");

  const handleSubmit = async () => {
    try {
      console.log("Sending prompt:", prompt);
      const newResponse = await chatWithLLM(prompt);
      console.log("!!!!chatWithLLM returned:", newResponse);
      setResponse(newResponse);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setResponse("Error: " + (error as Error).message);
    }
  };

  useEffect(() => {
    const handleMessage = (payload: any) => {
      const newToken = payload.choices?.[0]?.delta?.content;
      //console.log("newToken:", newToken);
      if (newToken) {
        // Append the new token to the existing text
        setStreamedText((prev) => prev + newToken);
      }

      // Optional: check if the stream ended
      if (payload.choices?.[0]?.finishReason) {
        console.log(
          "Stream ended, finishReason:",
          payload.choices[0].finishReason
        );
      }
    };

    // Attach the listener
    openAI.chat.addListener("onChatMessageReceived", handleMessage);

    // Cleanup: remove listener on unmount
    return () => {
      openAI.chat.removeListener("onChatMessageReceived", handleMessage);
    };
  }, [openAI]);

  const handleStream = () => {
    setStreamedText("");

    openAI.chat.stream({
      messages: [
        {
          role: "user",
          content: promptForStreaming,
        },
      ],
      model: "gpt-4o-mini",
    });
  };

  return (
    <View>
      <Text>from LLM:</Text>
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        style={{ borderWidth: 1, padding: 8, margin: 8 }}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Text>{response}</Text>

      <Text>Streaming :</Text>
      <TextInput
        value={promptForStreaming}
        onChangeText={setPromptForStreaming}
        style={{ borderWidth: 1, padding: 8, margin: 8 }}
      />
      <Button title="Submit Streaming" onPress={handleStream} />

      <Text>{streamedText}</Text>
    </View>
  );
}

export default LLMPoc;
