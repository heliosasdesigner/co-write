import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import NavBar from "../navigation/NavBar";

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  "New Story": undefined;
  "Story Rooms": undefined;
  Profile: undefined;
  "Chat List": undefined;
  Chats: undefined;
  StoryDetails: {
    id: string;
    userId: string;
    topic: string;
    title: string;
    createdAt: any;
    image?: string;
    lastMessage: string;
    lastMessageTimestamp: any;
    isFinished: boolean;
    wordLimit: number;
    votes: number;
  };
};

type PageLayoutProps = {
  children: React.ReactNode;
  currentTab: keyof RootStackParamList;
  scrollable?: boolean;
};

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  currentTab,
  scrollable = false,
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;
  return (
    <View style={styles.container}>
      <ContentWrapper
        contentContainerStyle={scrollable && styles.scrollContent}
        style={styles.content}
      >
        {children}
      </ContentWrapper>
      <NavBar currentTab={currentTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default PageLayout;
