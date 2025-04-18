import { db, storage } from "../firebase/config";
import {
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { downloadBlob } from "../src/utilities/dbHelper";

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

export const uploadSectionImages = async (
  imageSourceUrl: string,
  storyId: string
): Promise<string> => {
  console.log("imageSourceUrl", imageSourceUrl);
  console.log("storyId", storyId);

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
  const filePath = `stories/${storyId}/sectionImages/${Date.now()}`;
  const storageRef = ref(storage, filePath);

  console.log("⏳ Uploading to Storage at:", filePath);
  await uploadBytes(storageRef, blob, { contentType: blob.type });

  // 3️⃣ Get the permanent download URL
  const url = await getDownloadURL(storageRef);
  console.log("✅ Uploaded to Storage, URL:", url);

  // 4️⃣ Link it into Firestore
  const storyDoc = doc(db, "stories", storyId);
  await updateDoc(storyDoc, {
    sectionImages: arrayUnion(url),
  });
  console.log("✅ Added URL to Firestore document");

  return url;
};
