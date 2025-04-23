import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";

export const getUsersByUsername = async (username: string) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("username", "==", username));
  const usersSnapshot = await getDocs(q);
  return usersSnapshot.docs.map((doc) => doc.data());
};
