import React from "react";
import { Text, StyleSheet, Image, View } from "react-native";
import PageLayout from "../components/PageLayout";

const ProfilePage = () => {
  return (
    <PageLayout currentTab="Profile">
      <View style={styles.content}>
        <Text style={styles.name}>Your Profile</Text>
        <Image
          style={styles.avatar}
          source={{ uri: "https://via.placeholder.com/100" }}
        />
        <Text style={styles.info}>Username: yourname</Text>
        <Text style={styles.info}>Email: you@example.com</Text>
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    marginTop: 40,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProfilePage;
