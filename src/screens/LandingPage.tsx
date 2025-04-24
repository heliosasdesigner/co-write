import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import Header from "../components/Header";
import StoryCard from "../components/StoryCard";
import PageLayout from "../components/PageLayout";
import { landingStyles, headerStyles } from "../styles";

interface Chat {
  id: string;
  topic: string;
  createdAt: Date;
  image?: string;
  userId: string;
  title: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  isFinished: boolean;
  wordLimit: number;
  votes: number;
  [key: string]: any;
}
import { getAuth } from "firebase/auth";

const LandingPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const q = query(collection(db, "chats"));

        const querySnapshot = await getDocs(q);
        console.log("Total chats fetched:", querySnapshot.docs.length);

        const data = querySnapshot.docs
          .map((doc) => {
            const chatData = doc.data();
            console.log("Chat data:", {
              id: doc.id,
              isFinished: chatData.isFinished,
              hasImage: !!chatData.image,
              title: chatData.title,
              topic: chatData.topic,
            });
            return {
              id: doc.id,
              userId: chatData.userId || "",
              topic: chatData.topic,
              image: chatData.image,
              title: chatData.title,
              lastMessage: chatData.lastMessage,
              lastMessageTimestamp: chatData.lastMessageTimestamp?.toDate
                ? chatData.lastMessageTimestamp.toDate()
                : chatData.lastMessageTimestamp,
              isFinished: chatData.isFinished || false,
              wordLimit: chatData.wordLimit || 100,
              votes: chatData.votes || 0,
              createdAt: chatData.createdAt?.toDate
                ? chatData.createdAt.toDate()
                : chatData.createdAt,
            };
          })
          .filter((chat) => {
            const shouldShow = chat.isFinished && chat.image;
            console.log("Filtering chat:", {
              id: chat.id,
              isFinished: chat.isFinished,
              hasImage: !!chat.image,
              shouldShow,
            });
            return shouldShow;
          });

        console.log("Filtered chats:", data.length);
        setChats(data);
      } catch (error: unknown) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  return (
    <PageLayout currentTab="Home" scrollable>
      <View style={headerStyles.header}>
        <Text style={headerStyles.title}>Home</Text>
      </View>

      <ScrollView contentContainerStyle={landingStyles.grid}>
        {chats.length === 0 ? (
          <View style={landingStyles.emptyState}>
            <Text style={landingStyles.emptyStateText}>
              No completed stories found
            </Text>
          </View>
        ) : (
          chats.map((chat) => (
            <View key={chat.id} style={landingStyles.cardWrapper}>
              <StoryCard
                id={chat.id}
                userId={chat.userId}
                topic={chat.topic}
                createdAt={chat.createdAt}
                image={chat.image}
                title={chat.title}
                lastMessage={chat.lastMessage}
                lastMessageTimestamp={chat.lastMessageTimestamp}
                isFinished={chat.isFinished}
                wordLimit={chat.wordLimit}
                votes={chat.votes}
              />
            </View>
          ))
        )}
      </ScrollView>
    </PageLayout>
  );
};

export default LandingPage;
