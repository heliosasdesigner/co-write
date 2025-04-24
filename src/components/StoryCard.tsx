import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Timestamp } from "firebase/firestore";
import { storyCardStyles } from "../styles";

type RootStackParamList = {
  StoryDetails: {
    id: string;
    userId: string;
    topic: string;
    title: string;
    createdAt: string;
    image?: string;
    lastMessage: string;
    lastMessageTimestamp: Date;
    isFinished: boolean;
    wordLimit: number;
    votes: number;
  };
};

type Props = {
  id: string;
  userId: string;
  topic: string;
  title: string;
  createdAt: any;
  image?: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  isFinished: boolean;
  wordLimit: number;
  votes: number;
};

const StoryCard = ({
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
  votes,
}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Only show completed stories with images
  if (!isFinished || !image) {
    return null;
  }

  const createdDate =
    createdAt instanceof Timestamp ? createdAt.toDate() : createdAt;
  const formattedDate = createdDate
    ? new Date(createdDate).toLocaleString()
    : "No date";

  const lastMessageDate =
    lastMessageTimestamp instanceof Timestamp
      ? lastMessageTimestamp.toDate().toLocaleString()
      : lastMessageTimestamp
      ? new Date(lastMessageTimestamp).toLocaleString()
      : "No date";

  const handlePress = () => {
    navigation.navigate("StoryDetails", {
      id,
      userId,
      topic,
      title,
      createdAt: formattedDate,
      image,
      lastMessage,
      lastMessageTimestamp,
      isFinished,
      wordLimit,
      votes,
    });
  };

  return (
    <TouchableOpacity style={storyCardStyles.card} onPress={handlePress}>
      <View style={storyCardStyles.container}>
        <Image
          style={storyCardStyles.image}
          source={{
            uri: image,
          }}
        />
        <View style={storyCardStyles.content}>
          <Text style={storyCardStyles.title} numberOfLines={2}>
            {title || topic}
          </Text>
          <Text style={storyCardStyles.topic} numberOfLines={1}>
            {topic}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryCard;
