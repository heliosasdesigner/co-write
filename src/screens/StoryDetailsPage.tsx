import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import PageLayout from "../components/PageLayout";
import { db } from "../../firebase/config";
import { updateDoc, increment, doc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { RouteProp } from "@react-navigation/native";

interface StoryDetailsParams {
  id: string;
  userId: string;
  topic: string;
  title: string;
  createdAt: Timestamp | Date;
  image?: string;
  lastMessage: string;
  lastMessageTimestamp: Timestamp | Date;
  isFinished: boolean;
  wordLimit: number;
  votes: number;
}

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  "New Story": undefined;
  "Story Rooms": undefined;
  Profile: undefined;
  "Chat List": undefined;
  Chats: undefined;
  StoryDetails: StoryDetailsParams;
};

type StoryDetailsRouteProp = RouteProp<RootStackParamList, "StoryDetails">;

interface StoryDetailsPageProps {
  route: StoryDetailsRouteProp;
}

const StoryDetailsPage: React.FC<StoryDetailsPageProps> = ({ route }) => {
  const {
    id,
    userId,
    topic,
    title,
    createdAt,
    image,
    lastMessage,
    lastMessageTimestamp,
    isFinished,
    wordLimit,
    votes: initialVotes = 0,
  } = route.params;

  const [votes, setVotes] = useState(initialVotes);

  useEffect(() => {
    if (!id) {
      console.error("Story ID is missing!");
    }
  }, [id]);

  const handleVote = async (amount: number) => {
    try {
      if (!id) throw new Error("Story ID is missing.");

      const chatRef = doc(db, "chats", id);

      await updateDoc(chatRef, {
        votes: increment(amount),
      });

      setVotes((prev) => prev + amount);
    } catch (error: unknown) {
      console.error(
        "Error updating votes:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  // Format timestamps
  const formatDate = (timestamp: Timestamp | Date) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <PageLayout currentTab="Home" scrollable>
      <View style={styles.container}>
        <Text style={styles.title}>{title || topic}</Text>
        <Text style={styles.date}>Created: {formatDate(createdAt)}</Text>
        <Text style={styles.date}>
          Last updated: {formatDate(lastMessageTimestamp)}
        </Text>

        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              isFinished ? styles.completed : styles.inProgress,
            ]}
          >
            {isFinished ? "Completed" : "In Progress"}
          </Text>
          <Text style={styles.wordLimit}>Word Limit: {wordLimit}</Text>
        </View>

        <Text style={styles.lastMessage}>{lastMessage}</Text>

        {image && (
          <Image
            style={styles.image}
            source={{
              uri: image,
            }}
          />
        )}

        <View style={styles.voteRow}>
          <TouchableOpacity
            onPress={() => handleVote(1)}
            style={styles.voteButton}
          >
            <Text style={styles.voteText}>👍</Text>
          </TouchableOpacity>
          <Text style={styles.voteCount}>{votes}</Text>
          <TouchableOpacity
            onPress={() => handleVote(-1)}
            style={styles.voteButton}
          >
            <Text style={styles.voteText}>👎</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completed: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  inProgress: {
    backgroundColor: "#FFF3E0",
    color: "#E65100",
  },
  wordLimit: {
    fontSize: 14,
    color: "#666",
  },
  lastMessage: {
    fontSize: 16,
    color: "#333",
    marginVertical: 12,
    lineHeight: 24,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 12,
  },
  voteRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  voteButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#dde5f3",
    marginHorizontal: 20,
  },
  voteText: {
    fontSize: 18,
  },
  voteCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default StoryDetailsPage;
