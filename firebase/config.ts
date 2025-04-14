// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// get the API key from local environment
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
console.log("FIREBASE_API_KEY", FIREBASE_API_KEY);
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "indecisive-reactnative.firebaseapp.com",
  projectId: "indecisive-reactnative",
  storageBucket: "indecisive-reactnative.firebasestorage.app",
  messagingSenderId: "958136445072",
  appId: "1:958136445072:web:cefd3e238b96efd16cd015",
  measurementId: "G-7Q53XNL2QC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const auth = getAuth(app);
const firestore = getFirestore(app);

export { firestore };
