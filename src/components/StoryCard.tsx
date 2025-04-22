import React from "react";
import { View, Text, Image } from "react-native";
import { storyCardStyles } from "../styles";

type Props = {
  topic: string;
  createdAt: any;
  video?: string;
};

const StoryCard = ({ topic, createdAt, video }: Props) => {
  const createdDate = createdAt.toDate ? createdAt.toDate() : createdAt;
  const formattedDate = createdDate.toLocaleString();

  return (
    <View style={storyCardStyles.card}>
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
    </View>
  );
};

export default StoryCard;
