import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";

type Props =
  // | {
  //     visible: boolean;
  //     onClose: () => void;
  //     onCreateChat: (
  //       aiAssistant: true,
  //       otherUserId: string,
  //       topic: string,
  //       wordLimit: number,
  //       numberOfPages?: string
  //     ) => void;
  //   }
  {
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
  const [otherUserId, setOtherUserId] = useState("");
  const [topic, setTopic] = useState("");
  const [wordLimit, setWordLimit] = useState("");
  const [aiAssistant, setaiAssistant] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState("");
  const [title, setTitle] = useState("");
  const [isAI, setIsAI] = useState(false);

  const handleUserTypeChange = (value: boolean) => {
    setIsAI(value);
    if (value) {
      setOtherUserId("AI");
    } else {
      setOtherUserId("");
    }
  };

  const handleCreate = () => {
    const limit = parseInt(wordLimit);
    if (!otherUserId || !topic || isNaN(limit) || limit < 1) return;
    onCreateChat(
      otherUserId.trim(),
      aiAssistant,
      title.trim(),
      topic.trim(),
      limit,
      numberOfPages
    );
    setOtherUserId("");
    setaiAssistant(false);
    setTitle("");
    setTopic("");
    setWordLimit("");
    setNumberOfPages("");
    setIsAI(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>New Chat</Text>
          <View style={styles.toggleContainer}>
            <Text>User Type: {isAI ? "AI" : "Other"}</Text>
            <Switch value={isAI} onValueChange={handleUserTypeChange} />
          </View>
          <TextInput
            placeholder="Other User ID"
            value={otherUserId}
            onChangeText={setOtherUserId}
            style={styles.input}
            editable={!isAI}
          />
          <Text>AI Assistant?</Text>
          <Switch value={aiAssistant} onValueChange={setaiAssistant} />
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Chat Topic"
            value={topic}
            onChangeText={setTopic}
            style={styles.input}
          />
          <TextInput
            placeholder="Word Limit"
            value={wordLimit}
            onChangeText={setWordLimit}
            style={styles.input}
            keyboardType="number-pad"
          />
          <TextInput
            placeholder="Number of Pages"
            value={numberOfPages}
            onChangeText={setNumberOfPages}
            style={styles.input}
            keyboardType="number-pad"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreate} style={styles.create}>
              <Text style={{ color: "white" }}>Create</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancel: {
    marginRight: 16,
    padding: 8,
  },
  create: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
});
