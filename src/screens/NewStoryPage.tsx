import React, { useEffect, useState } from "react";
import { Text, StyleSheet, FlatList, View } from "react-native";
import PageLayout from "../components/PageLayout";
import OpenRouter from "../components/OpenRouter";
import ExampleImageGeneration from "../components/ExampleImageGeneration";
import ExampleResponseStream from "../components/ExampleResponseStream";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

const NewStoryPage = () => {
    const [userStories, setUserStories] = useState([]);

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const q = query(collection(db, "stories"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const storiesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserStories(storiesData);
            } catch (err) {
                console.error("Error fetching user stories:", err);
            }
        };

        fetchUserStories();
    }, []);

    return (
        <PageLayout currentTab="New Story">
            <ExampleImageGeneration />
            <ExampleResponseStream />

            <Text style={styles.title}>OpenRouter:</Text>
            <OpenRouter />

            <Text style={styles.sectionTitle}>Your Past Stories</Text>
            <FlatList
                data={userStories}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item, index }) => (
                    <View style={styles.storyCard}>
                        <Text style={styles.storyTitle}>
                            {index + 1}. {item.title || item.topic || "Untitled"}
                        </Text>
                        {item.createdAt?.toDate && (
                            <Text style={styles.storyDate}>
                                {item.createdAt.toDate().toLocaleString()}
                            </Text>
                        )}
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.noStories}>No stories yet. Generate one above!</Text>
                }
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 32,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    storyCard: {
        backgroundColor: "#f3f3f3",
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 8,
        padding: 12,
    },
    storyTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    storyDate: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    noStories: {
        textAlign: "center",
        color: "#888",
        fontStyle: "italic",
        marginTop: 10,
    },
});

export default NewStoryPage;
