import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import PageLayout from "../components/PageLayout";
import { db } from "../../firebase/config";
import { updateDoc, increment, doc } from "firebase/firestore";

const StoryDetailsPage = ({ route }) => {
  const {
    id,
    topic,
    createdAt,
    video,
    votes: initialVotes = 0,
    userId,
  } = route.params;

  const [votes, setVotes] = useState(initialVotes);

  useEffect(() => {
    if (!id) {
      console.error("Story ID is missing!");
    }
  }, [id]);

  const handleVote = async (amount) => {
    try {
      if (!id) throw new Error("Story ID is missing.");

      const storyRef = doc(db, "stories", id);

      await updateDoc(storyRef, {
        votes: increment(amount),
      });

      setVotes((prev) => prev + amount);
    } catch (error) {
      console.error("Error updating votes:", error.message || error);
    }
  };

  return (
    <PageLayout currentTab={null} scrollable>
      <View style={styles.container}>
        <Text style={styles.title}>{topic}</Text>
        <Text style={styles.date}>{new Date(createdAt).toLocaleString()}</Text>

        {video && (
          <Image
            style={styles.image}
            source={{
              uri: "https://www.seekscholar.com/sites/default/files/styles/node_image/public/1_b1T9PtMK3bxboKvnSctNmg.jpeg?itok=EwzrcGcU",
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
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  date: { fontSize: 14, color: "#666", marginVertical: 8 },
  image: { width: "100%", height: 200, borderRadius: 8 },
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
