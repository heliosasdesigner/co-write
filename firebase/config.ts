// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAvB-m-kCaII3LcKXRJeeQqBzOq826fze4',
  authDomain: 'indecisive-reactnative.firebaseapp.com',
  projectId: 'indecisive-reactnative',
  storageBucket: 'indecisive-reactnative.firebasestorage.app',
  messagingSenderId: '958136445072',
  appId: '1:958136445072:web:38760288628b26c06cd015',
  measurementId: 'G-6QCYMVK9CY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// initialize firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
