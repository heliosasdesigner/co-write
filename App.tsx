
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import LandingPage from "./src/screens/LandingPage";


export default function App() {
  const sampleVideo = require("./assets/sampleVideo.mp4");

  const [stories, setStories] = useState<Story[]>([]);
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const results: Story[] = await getStories();
        setStories(results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStories();
  }, []);

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello! this is co-write</Text>
        <Text style={styles.subtitle}>This is a subtitle</Text>
      </View>
      <LandingPage />
      <StatusBar style="auto" />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "normal",
  },
  video: {
    width: "100%",
    height: 200,
    backgroundColor: "black",
  },
});
