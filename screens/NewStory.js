import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const NewStory = () => {
  const navigation = useNavigation();

  const [topic, setTopic] = useState("");
  const [aiAssistant, setAiAssistant] = useState(false);
  const [numPages, setNumPages] = useState("1");
  const [wordLimit, setWordLimit] = useState("100");

  const handleStart = () => {
    navigation.navigate("Chats", {
      topic,
      aiAssistant,
      numPages,
      wordLimit,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Story Setup</Text>

      <Text style={styles.label}>Topic</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a story topic"
        value={topic}
        onChangeText={setTopic}
      />

      <Text style={styles.label}>AI Assistant?</Text>
      <Switch value={aiAssistant} onValueChange={setAiAssistant} />

      <Text style={styles.label}>Number of Pages</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={numPages}
        onChangeText={setNumPages}
      />

      <Text style={styles.label}>Word Limit</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={wordLimit}
        onChangeText={setWordLimit}
      />

      <Button title="Start" onPress={handleStart} />
    </View>
  );
};

export default NewStory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginTop: 5,
    padding: 8,
  },
});
