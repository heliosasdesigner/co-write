import React from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import PageLayout from "../components/PageLayout";

const mockRooms = [
  { id: "1", title: "story 1" },
  { id: "2", title: "story 2" },
  { id: "3", title: "story 3" },
];

const StoryRoomsPage = () => {
  return (
    <PageLayout currentTab="Story Rooms">
      <Text style={styles.title}>Story Rooms</Text>
      <FlatList
        data={mockRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.room}>
            <Text style={styles.roomText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 40,
  },
  room: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  roomText: {
    fontSize: 16,
  },
});

export default StoryRoomsPage;
