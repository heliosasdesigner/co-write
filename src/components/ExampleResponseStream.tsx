import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { useOpenAIStream } from "../hooks/useOpenAIStream";

interface Prompt {
  role: "system" | "user" | "assistant";
  content: string;
}

const ExampleResponseStream = () => {
  const [draftPrompt, setDraftPrompt] = useState<string>("");
  const { isStreaming, error, streamedText, startStream } = useOpenAIStream();

  const prompts = useMemo(
    () => [
      {
        role: "system",
        content:
          "You are the best storyteller in the world. Continue writing a story based on the user's input within 100 words.",
      },
      { role: "user", content: draftPrompt },
    ],
    [draftPrompt]
  );

  return (
    <View>
      <Text style={styles.title}>OpenAI Response Streaming:</Text>
      <Text>Streaming :</Text>
      {isStreaming && <Text>um...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {streamedText && <Text>{streamedText}</Text>}
      <TextInput
        value={draftPrompt}
        placeholder="Type your story prompt…"
        onChangeText={setDraftPrompt}
        style={{ borderWidth: 1, padding: 8, margin: 8 }}
      />
      <Button
        title="Submit Streaming"
        onPress={() => startStream(prompts as Prompt[])}
        disabled={isStreaming || draftPrompt.trim() === ""}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 40,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginVertical: 16,
    alignSelf: "center",
  },
});

export default ExampleResponseStream;
