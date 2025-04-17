import React, { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    View,
} from "react-native";
import PageLayout from "../components/PageLayout";
import OpenRouter from "../components/OpenRouter";
import ExampleResponseStream from "../components/ExampleResponseStream";
import ExampleImageGeneration from "../components/ExampleImageGeneration";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

const StoryRoomsPage = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const q = query(
                    collection(db, "rooms"),
                    where("participants", "array-contains", user.uid)
                );

                const snapshot = await getDocs(q);
                const roomData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setRooms(roomData);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <PageLayout currentTab="Story Rooms">
            <Text style={styles.title}>Story Rooms</Text>

            <ExampleImageGeneration />
            <ExampleResponseStream />

            <Text style={styles.subtitle}>Your Rooms</Text>
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.room}>
                        <Text style={styles.roomText}>{item.name || "Untitled Room"}</Text>
                        {item.lastUpdated?.toDate && (
                            <Text style={styles.roomDate}>
                                Last updated: {item.lastUpdated.toDate().toLocaleString()}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        You’re not part of any story rooms yet.
                    </Text>
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
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 12,
        paddingHorizontal: 16,
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
        marginHorizontal: 16,
    },
    roomText: {
        fontSize: 16,
        fontWeight: "600",
    },
    roomDate: {
        fontSize: 12,
        color: "#666",
        marginTop: 6,
    },
    emptyText: {
        textAlign: "center",
        color: "#888",
        fontStyle: "italic",
        marginTop: 20,
        paddingHorizontal: 16,
    },
});

export default StoryRoomsPage;
