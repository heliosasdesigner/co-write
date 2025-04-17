import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
} from "react";
import { TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import PageLayout from "../components/PageLayout";

export default function Chats() {
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();

    // Sign out user
    const onSignOut = () => {
        signOut(auth).catch((error) =>
            console.log("Error logging out:", error)
        );
    };

    // Add logout button to the header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={onSignOut}
                >
                    <AntDesign name="logout" size={24} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // Load chat messages from Firestore
    useEffect(() => {
        const collectionRef = collection(db, "chats");
        const q = query(collectionRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(
                snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt?.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                }))
            );
        });

        return () => unsubscribe();
    }, []);

    // Send new message
    const onSend = useCallback((messages = []) => {
        setMessages((prevMessages) =>
            GiftedChat.append(prevMessages, messages)
        );

        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(db, "chats"), {
            _id,
            createdAt,
            text,
            user,
        });
    }, []);

    return (
        <PageLayout currentTab={"Chats"}>
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: auth?.currentUser?.uid || "unknown",
                    name: auth?.currentUser?.email || "Anonymous",
                }}
            />
        </PageLayout>
    );
}
