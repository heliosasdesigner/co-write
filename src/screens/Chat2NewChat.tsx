import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { newChatModalStyles } from "../styles";

const STORY_MODES = [
  { id: "ai", label: "Co-Write with AI", value: "AI" },
  { id: "user", label: "Write with Another User", value: "user" },
];

const STORY_TOPICS = [
  "Fantasy Adventure",
  "Mystery and Detective",
  "Science Fiction",
  "Romance",
  "Historical Fiction",
  "Horror and Suspense",
  "Children's Stories",
  "Fairy Tales",
  "Superhero Stories",
  "Animal Adventures",
];

type RootStackParamList = {
  "Story Rooms": undefined;
  "New Story": {
    onCreateChat: (
      otherUserId: string,
      aiAssistant: boolean,
      title: string,
      topic: string,
      wordLimit: number,
      numberOfPages?: string
    ) => void;
  };
  ChatScreen: { chatId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type NewStoryRouteProp = RouteProp<RootStackParamList, "New Story">;

const NewChatPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<NewStoryRouteProp>();

  // Set default values
  const [mode, setMode] = useState(STORY_MODES[0].value);
  const [otherUserId, setOtherUserId] = useState("");
  const [topic, setTopic] = useState(STORY_TOPICS[0]);
  const [wordLimit, setWordLimit] = useState("100");
  const [numberOfPages, setNumberOfPages] = useState("12");
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    const limit = parseInt(wordLimit);
    const pages = parseInt(numberOfPages);

    // Validation
    if (!title || !topic) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isNaN(limit) || limit < 1 || limit > 500) {
      Alert.alert("Error", "Word limit must be between 1 and 500 words");
      return;
    }

    if (isNaN(pages) || pages < 1 || pages > 50) {
      Alert.alert("Error", "Number of pages must be between 1 and 50");
      return;
    }

    if (mode === "user" && !otherUserId.trim()) {
      Alert.alert("Error", "Please enter the other user's ID");
      return;
    }

    if (!route.params?.onCreateChat) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      return;
    }

    route.params.onCreateChat(
      mode === "AI" ? "AI" : otherUserId.trim(),
      mode === "AI",
      title.trim(),
      topic.trim(),
      limit,
      numberOfPages
    );

    // Reset form
    setTitle("");
    setTopic(STORY_TOPICS[0]);
    setOtherUserId("");
    setMode(STORY_MODES[0].value);
    setWordLimit("100");
    setNumberOfPages("12");
    navigation.goBack();
  };

  const handleWordLimitChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setWordLimit(numericValue);
  };

  const handlePagesChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setNumberOfPages(numericValue);
  };

  return (
    <SafeAreaView style={newChatModalStyles.container}>
      <View style={newChatModalStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={newChatModalStyles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
          <Text style={newChatModalStyles.backButtonText}>Story Rooms</Text>
        </TouchableOpacity>
        <Text style={newChatModalStyles.headerTitle}>Create Story</Text>
      </View>

      <ScrollView style={newChatModalStyles.content} bounces={false}>
        <Text style={newChatModalStyles.title}>New Co-Write Story</Text>

        <Text style={newChatModalStyles.label}>Writing Mode *</Text>
        <View style={newChatModalStyles.pickerContainer}>
          <Picker
            selectedValue={mode}
            onValueChange={(itemValue) => setMode(itemValue)}
            style={newChatModalStyles.picker}
            itemStyle={{ fontSize: 17, color: "#333", height: 50 }}
          >
            {STORY_MODES.map((m) => (
              <Picker.Item
                key={m.id}
                label={m.label}
                value={m.value}
                color={mode === m.value ? "#007AFF" : "#333"}
              />
            ))}
          </Picker>
        </View>

        {mode === "user" && (
          <>
            <Text style={newChatModalStyles.label}>Other User ID *</Text>
            <TextInput
              placeholder="Enter user ID"
              value={otherUserId}
              onChangeText={setOtherUserId}
              style={newChatModalStyles.input}
            />
          </>
        )}

        <Text style={newChatModalStyles.label}>Story Title *</Text>
        <TextInput
          placeholder="Enter your story title"
          value={title}
          onChangeText={setTitle}
          style={newChatModalStyles.input}
        />

        <Text style={newChatModalStyles.label}>Story Topic *</Text>
        <View style={newChatModalStyles.pickerContainer}>
          <Picker
            selectedValue={topic}
            onValueChange={(itemValue) => setTopic(itemValue)}
            style={newChatModalStyles.picker}
            itemStyle={{ fontSize: 17, color: "#333", height: 50 }}
          >
            {STORY_TOPICS.map((t) => (
              <Picker.Item
                key={t}
                label={t}
                value={t}
                color={topic === t ? "#007AFF" : "#333"}
              />
            ))}
          </Picker>
        </View>

        <Text style={newChatModalStyles.label}>Word Limit per Page *</Text>
        <View style={newChatModalStyles.inputWithHelper}>
          <TextInput
            placeholder="Enter word limit"
            value={wordLimit}
            onChangeText={handleWordLimitChange}
            style={[newChatModalStyles.input, newChatModalStyles.numberInput]}
            keyboardType="number-pad"
          />
          <Text style={newChatModalStyles.helperText}>
            Default: 100 (Max: 500)
          </Text>
        </View>

        <Text style={newChatModalStyles.label}>Number of Pages *</Text>
        <View style={newChatModalStyles.inputWithHelper}>
          <TextInput
            placeholder="Enter number of pages"
            value={numberOfPages}
            onChangeText={handlePagesChange}
            style={[newChatModalStyles.input, newChatModalStyles.numberInput]}
            keyboardType="number-pad"
          />
          <Text style={newChatModalStyles.helperText}>
            Default: 12 (Max: 50)
          </Text>
        </View>

        <View style={newChatModalStyles.buttonRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={newChatModalStyles.cancel}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreate}
            style={newChatModalStyles.create}
          >
            <Text style={{ color: "white" }}>Create Story</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewChatPage;
