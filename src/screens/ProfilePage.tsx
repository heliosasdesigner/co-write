import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import NavBar from "../navigation/NavBar";

const stories = [
  { title: "Story 1", date: "2023-04-01" },
  { title: "Story 2", date: "2023-03-25" },
  { title: "Story 3", date: "2023-03-10" },
];

const ProfilePage = () => {
  const [filter, setFilter] = React.useState("date");

  const sortedStories = [...stories].sort((a, b) => {
    if (filter === "az") {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <View style={styles.container}>
      {/* Avatar & Username */}
      <Text style={styles.avatar}>👤</Text>
      <Text style={styles.username}>Username Placeholder</Text>
      <Text style={styles.bio}>Short Bio (optional)</Text>

      {/* Filter Section */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <Picker
          selectedValue={filter}
          style={styles.picker}
          onValueChange={(itemValue: string) => setFilter(itemValue)}
        >
          <Picker.Item label="Date Made" value="date" />
          <Picker.Item label="A - Z" value="az" />
        </Picker>
      </View>

      {/* Past Stories */}
      <Text style={styles.sectionTitle}>PAST STORIES</Text>
      <FlatList
        data={sortedStories}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item, index }) => (
          <Text style={styles.storyItem}>
            {index + 1}. {item.title}
          </Text>
        )}
      />

      {/* NavBar */}
      <NavBar currentTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  bio: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#888",
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterLabel: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  storyItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 6,
    borderRadius: 6,
    borderColor: "#ddd",
    borderWidth: 1,
  },
});

export default ProfilePage;

// import React from "react";
// import { Text, StyleSheet, Image, View } from "react-native";
// import PageLayout from "../components/PageLayout";

// const ProfilePage = () => {
//   return (
//     <PageLayout currentTab="Profile">
//       <View style={styles.content}>
//         <Text style={styles.name}>Your Profile</Text>
//         <Image
//           style={styles.avatar}
//           source={{ uri: "https://via.placeholder.com/100" }}
//         />
//         <Text style={styles.info}>Username: yourname</Text>
//         <Text style={styles.info}>Email: you@example.com</Text>
//       </View>
//     </PageLayout>
//   );
// };

// const styles = StyleSheet.create({
//   content: {
//     alignItems: "center",
//     marginTop: 40,
//   },
//   name: {
//     fontSize: 30,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 16,
//   },
//   info: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
// });

// export default ProfilePage;
