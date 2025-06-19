// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCbB8n0StIYJFyXGuknUbkAQZdtZStGMpI",
  authDomain: "hodayakashkash-85596.firebaseapp.com",
  projectId: "hodayakashkash-85596",
  storageBucket: "hodayakashkash-85596.appspot.com",
  messagingSenderId: "208702933497",
  appId: "1:208702933497:web:0e0bc417b3c45ee40fd528",
  measurementId: "G-EK1LZ8ZRCN"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);