import React from "react";

import { storyCardStyles } from "../styles";

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  StoryDetails: {
    id: string;
    userId: string;
    topic: string;
    createdAt: string;
    video?: string;
    votes?: number;
  };
};

type Props = {
  id: string;
  userId: string;
  topic: string;
  createdAt: any;
  video?: string;
  votes?: number;
};

const StoryCard = ({ id, userId, topic, createdAt, video, votes }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
    <TouchableOpacity style={storyCardStyles.card} onPress={handlePress}>
      <Text style={storyCardStyles.title}>{topic}</Text>
      <Text style={storyCardStyles.description}>{formattedDate}</Text>
      <Image
        style={storyCardStyles.footer}
        source={{
          uri: video
            ? "https://www.seekscholar.com/sites/default/files/styles/node_image/public/1_b1T9PtMK3bxboKvnSctNmg.jpeg?itok=EwzrcGcU"
            : "https://via.placeholder.com/100",
        }}
      />
    </TouchableOpacity>
  );
};

export default StoryCard;
