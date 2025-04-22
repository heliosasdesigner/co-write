import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = {
  id: string;
  userId: string;
  topic: string;
  createdAt: any;
  video?: string;
  votes?: number;
};

const StoryCard = ({ id, userId, topic, createdAt, video, votes }: Props) => {
  const navigation = useNavigation();
  const createdDate = createdAt.toDate ? createdAt.toDate() : createdAt;
  const formattedDate = createdDate.toLocaleString();

  const handlePress = () => {
    console.log("StoryCard ID:", id);
    navigation.navigate("StoryDetails", {
      id,
      userId,
      topic,
      createdAt: formattedDate,
      video,
      votes,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.tagRow}>
        <Text style={styles.tag}>{topic}</Text>
        <Text style={styles.tag}>{formattedDate}</Text>
      </View>
      <Image
        style={styles.image}
        source={{
          uri: video
            ? "https://www.seekscholar.com/sites/default/files/styles/node_image/public/1_b1T9PtMK3bxboKvnSctNmg.jpeg?itok=EwzrcGcU"
            : "https://via.placeholder.com/100",
        }}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    width: "32%",
    aspectRatio: 1,
    backgroundColor: "#c8d7e6",
    borderRadius: 8,
    padding: 2,
    marginBottom: 0,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tag: {
    fontSize: 10,
    backgroundColor: "#607192",
    color: "#fff",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  image: {
    flex: 1,
    marginTop: 8,
    borderRadius: 4,
  },
});

export default StoryCard;
