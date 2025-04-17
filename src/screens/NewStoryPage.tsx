import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { ChatsFlowParamList } from "../navigation/ChatsFlowStack";

type NewStoryNavProp = StackNavigationProp<ChatsFlowParamList, "NewStory">;

export default function NewStoryPage() {
  const navigation = useNavigation<NewStoryNavProp>();

  const [topic, setTopic] = useState("");
  const [aiAssistant, setAiAssistant] = useState(false);
  const [wordLimit, setWordLimit] = useState("100");
  const [pageLimit, setPageLimit] = useState("6");

  const handleStart = () => {
    navigation.navigate("ChatConversation", {
      topic,
      aiAssistant,
      wordLimit,
      numberOfPages: pageLimit,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Story</Text>

      <Text>Topic:</Text>
      <TextInput
        style={styles.input}
        value={topic}
        onChangeText={setTopic}
        placeholder="Type a topic..."
      />

      <Text>AI Assistant?</Text>
      <Switch value={aiAssistant} onValueChange={setAiAssistant} />

      <Text>Word Limit:</Text>
      <TextInput
        style={styles.input}
        value={wordLimit}
        onChangeText={setWordLimit}
        keyboardType="numeric"
      />

      <Text>Page Limit:</Text>
      <TextInput
        style={styles.input}
        value={pageLimit}
        onChangeText={setPageLimit}
        keyboardType="numeric"
      />

      <Button title="Start" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
  },
});
