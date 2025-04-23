import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

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

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreateChat: (
    otherUserId: string,
    aiAssistant: boolean,
    title: string,
    topic: string,
    wordLimit: number,
    numberOfPages?: string
  ) => void;
};

const NewChatModal: React.FC<Props> = ({ visible, onClose, onCreateChat }) => {
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
      alert("Please fill in all required fields");
      return;
    }

    if (isNaN(limit) || limit < 1 || limit > 500) {
      alert("Word limit must be between 1 and 500 words");
      return;
    }

    if (isNaN(pages) || pages < 1 || pages > 50) {
      alert("Number of pages must be between 1 and 50");
      return;
    }

    if (mode === "user" && !otherUserId.trim()) {
      alert("Please enter the other user's ID");
      return;
    }

    onCreateChat(
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
    onClose();
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>New Co-Write Story</Text>

            <Text style={styles.label}>Writing Mode *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={mode}
                onValueChange={(itemValue) => setMode(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {STORY_MODES.map((m) => (
                  <Picker.Item
                    key={m.id}
                    label={m.label}
                    value={m.value}
                    color="#333"
                  />
                ))}
              </Picker>
            </View>

            {mode === "user" && (
              <>
                <Text style={styles.label}>Other User ID *</Text>
                <TextInput
                  placeholder="Enter user ID"
                  value={otherUserId}
                  onChangeText={setOtherUserId}
                  style={styles.input}
                />
              </>
            )}

            <Text style={styles.label}>Story Title *</Text>
            <TextInput
              placeholder="Enter your story title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Story Topic *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={topic}
                onValueChange={(itemValue) => setTopic(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {STORY_TOPICS.map((t) => (
                  <Picker.Item key={t} label={t} value={t} color="#333" />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Word Limit per Page *</Text>
            <View style={styles.inputWithHelper}>
              <TextInput
                placeholder="Enter word limit"
                value={wordLimit}
                onChangeText={handleWordLimitChange}
                style={[styles.input, styles.numberInput]}
                keyboardType="number-pad"
              />
              <Text style={styles.helperText}>Default: 100 (Max: 500)</Text>
            </View>

            <Text style={styles.label}>Number of Pages *</Text>
            <View style={styles.inputWithHelper}>
              <TextInput
                placeholder="Enter number of pages"
                value={numberOfPages}
                onChangeText={handlePagesChange}
                style={[styles.input, styles.numberInput]}
                keyboardType="number-pad"
              />
              <Text style={styles.helperText}>Default: 12 (Max: 50)</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose} style={styles.cancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={styles.create}>
                <Text style={{ color: "white" }}>Create Story</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NewChatModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "transparent",
  },
  pickerItem: {
    fontSize: 16,
    height: 50,
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancel: {
    marginRight: 16,
    padding: 12,
  },
  create: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  inputWithHelper: {
    marginBottom: 16,
  },
  numberInput: {
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
});
