import { db, storage } from "../../firebase/config";
import {
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

export interface Story {
  id: string;
  title: string;
  topic: string;
  username: string;
  video: string;
  sectionImages: string[];
  votes: number;
  createdAt: Timestamp;
  joinUser: string[];
  aiAssistant?: boolean;
  wordLimit?: string;
  pageLimit?: string;
}

export const getStories = async (): Promise<ChatMessage[]> => {
  const chatsCollection = collection(db, "chats");
  const q = query(chatsCollection, orderBy("createdAt", "asc"));
  const chatsSnapshot = await getDocs(q);
  return chatsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
};

export const getUserStories = async (
  username: string
): Promise<ChatMessage[]> => {
  const chatsCollection = collection(db, "chats");
  const q = query(
    chatsCollection,
    where("user._id", "==", username),
    orderBy("createdAt", "asc")
  );
  const chatsSnapshot = await getDocs(q);
  return chatsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
};

export type NewStory = Omit<Story, "id" | "createdAt">;

export const createStory = async (storyData: NewStory) => {
  try {
    const storyDocRef = await addDoc(collection(db, "stories"), {
      ...storyData,
      createdAt: serverTimestamp(),
    });
    return storyDocRef;
  } catch (err) {
    console.error("Error create stroy: ", err);
    throw err;
  }
};

export const uploadSectionImages = async (
  imageSourceUrl: string,
  chatId: string
): Promise<string> => {
  console.log("imageSourceUrl", imageSourceUrl);
  console.log("chatId", chatId);

  const response = await fetch(imageSourceUrl);
  console.log("response", response);
  if (!response.ok) {
    throw new Error("Failed to download blob");
  }
  const blob = await response.blob();

  console.log(
    "✅ Got blob —",
    "size:",
    blob.size,
    "bytes;",
    "type:",
    blob.type
  );

  // now upload to Storage
  const filePath = `chats/${chatId}/sectionImages/${Date.now()}`;
  const storageRef = ref(storage, filePath);

  console.log("⏳ Uploading to Storage at:", filePath);
  await uploadBytes(storageRef, blob, { contentType: blob.type });

  // 3️⃣ Get the permanent download URL
  const url = await getDownloadURL(storageRef);
  console.log("✅ Uploaded to Storage, URL:", url);

  // 4️⃣ Link it into Firestore
  const chatDoc = doc(db, "chats", chatId);
  await updateDoc(chatDoc, {
    sectionImages: arrayUnion(url),
  });
  console.log("✅ Added URL to Firestore document");

  return url;
};

export const createInitialChat = async (
  storyId: string,
  topic: string,
  aiAssistant: boolean,
  wordLimit: string,
  numberOfPages: string
) => {
  try {
    const chatCollectionRef = collection(db, `stories/${storyId}/chats`);
    const initialMessage = {
      text: `Welcome to a story about "${topic}".\nAI: ${aiAssistant}\nWord Limit: ${wordLimit}\nPages: ${numberOfPages}`,
      createdAt: serverTimestamp(),
      user: { _id: "System" },
    };

    await addDoc(chatCollectionRef, initialMessage);
  } catch (err) {
    console.error("Error creating initial chat: ", err);
    throw err;
  }
};

// Add types and functions for chat messages
export interface ChatMessage {
  id: string;
  text: string;
  createdAt: Timestamp;
  user: {
    _id: string;
  };
}

export const getStoryChats = async (
  storyId: string
): Promise<ChatMessage[]> => {
  try {
    const chatCollectionRef = collection(db, `stories/${storyId}/chats`);
    const q = query(chatCollectionRef, orderBy("createdAt", "asc"));
    const chatsSnapshot = await getDocs(q);

    return chatsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
  } catch (err) {
    console.error("Error fetching story chats:", err);
    throw err;
  }
};

export const addChatMessage = async (
  storyId: string,
  message: Omit<ChatMessage, "id" | "createdAt">
) => {
  try {
    const chatCollectionRef = collection(db, `stories/${storyId}/chats`);
    const messageWithTimestamp = {
      ...message,
      createdAt: serverTimestamp(),
    };

    await addDoc(chatCollectionRef, messageWithTimestamp);
  } catch (err) {
    console.error("Error adding chat message:", err);
    throw err;
  }
};

export const fetchSectionImages = async (chatId: string): Promise<string[]> => {
  try {
    const chatDoc = doc(db, "chats", chatId);
    const chatSnapshot = await getDocs(collection(chatDoc, "messages"));

    // Filter messages that have imageUrl and are from AI
    const images = chatSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return data.senderId === "AI" && data.imageUrl;
      })
      .map((doc) => doc.data().imageUrl);

    return images;
  } catch (err) {
    console.error("Error fetching section images:", err);
    throw err;
  }
};
