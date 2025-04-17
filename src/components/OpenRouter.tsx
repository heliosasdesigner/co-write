/**
 * LLM Proof of Concept Component
 *
 * This component demonstrates two ways of interacting with LLMs:
 * 1. Standard API call with complete response
 * 2. Streaming response using Server-Sent Events (SSE)
 *   2.1 react-native-openai not support Openrouter API -> use RNBlobUtil
 *
 * The streaming implementation shows how to process raw SSE data into
 * readable text chunks using a multi-step transformation process.
 */

import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { chatWithLLM } from "../../LLMs/config";
import Constants from "expo-constants";
import RNBlobUtil from "react-native-blob-util";

// Get OpenRouter API key from Expo config
const { OPENROUTER_API_KEY } = Constants.expoConfig?.extra || {};

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined");
}

function OpenRouter() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  // Handle standard API call to LLM
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

  // State for streaming implementation
  const [promptForStreaming, setPromptForStreaming] = useState("");
  const [streamedResponse, setStreamedResponse] = useState("");

  /**
   * Handles streaming response from LLM using Server-Sent Events (SSE)
   * Data processing flow:
   * 1. Raw SSE data -> Split into lines
   * 2. Each line -> Extract JSON string
   * 3. JSON string -> Parse into object
   * 4. Object -> Extract text chunk
   * 5. Text chunk -> Update state
   */
  const handleStream = async () => {
    console.log("handleStream called");
    try {
      RNBlobUtil.fetch(
        "POST",
        "https://openrouter.ai/api/v1/chat/completions",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          Accept: "text/event-stream",
        },
        JSON.stringify({
          messages: [{ role: "user", content: promptForStreaming }],
          model: "meta-llama/llama-4-scout:free",
          stream: true,
        })
      ).then((response) => {
        // Step 1: Get raw SSE data and split into lines
        const rawSSE: string = response.data;
        const lines = rawSSE.split("\n");

        // Process each line of the SSE response
        lines.forEach((line: string) => {
          // Step 2: Check if line contains data
          if (line.startsWith("data:")) {
            // Extract JSON string from data line
            const chunkStr = line.replace("data:", "").trim();

            // Check for stream completion
            if (chunkStr === "[DONE]") {
              console.log("DONE");
              // Closing Flag is here
              return;
            }

            if (chunkStr) {
              try {
                // Step 3: Parse JSON string into object
                const parsedChunk = JSON.parse(chunkStr);
                // Step 4: Extract text content from the object
                const text = parsedChunk.choices[0].delta.content;
                // Step 5: Update state with new text chunk
                setStreamedResponse((prev) => prev + text);
              } catch (err) {
                console.warn("Failed to parse chunk:", err);
              }
            }
          }
        });
      });
    } catch (error) {
      console.error("Stream handling error:", error);
    }
  };

  return (
    <View>
      {/* Standard API Call Section */}
      <Text>OpenRouter Standard API Call :</Text>
      <TextInput
        value={prompt}
        onChangeText={setPrompt}
        style={{ borderWidth: 1, padding: 8, margin: 8 }}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Text>{response}</Text>

      {/* Streaming Section */}
      <Text>OpenRouterStreaming :</Text>
      <TextInput
        value={promptForStreaming}
        onChangeText={setPromptForStreaming}
        style={{ borderWidth: 1, padding: 8, margin: 8 }}
      />
      <Button title="Submit Streaming" onPress={handleStream} />

      <Text>{streamedResponse}</Text>
    </View>
  );
}

export default OpenRouter;
