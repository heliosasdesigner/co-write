import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
  addDoc,
} from "firebase/firestore";

export interface Story {
  id: string;
  title: string;
  topic: string;
  username: string;
  video: string;
  votes: number;
  createdAt: Timestamp;
  joinUser: string[];
}

export const getStories = async (): Promise<Story[]> => {
  const storiesCollection = collection(db, "stories");
  const storiesSnapshot = await getDocs(storiesCollection);
  return storiesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Story[];
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
