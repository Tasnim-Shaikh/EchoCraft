import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // 1. You are missing this import

const firebaseConfig = {
  apiKey: "AIzaSyBJFmRSqLRF_1MCLYWfkrvIZaxDEBgfUDo",
  authDomain: "ai-podcast-generator-e0e6c.firebaseapp.com",
  databaseURL: "https://ai-podcast-generator-e0e6c-default-rtdb.firebaseio.com/",
  projectId: "ai-podcast-generator-e0e6c",
  storageBucket: "ai-podcast-generator-e0e6c.appspot.com",
  messagingSenderId: "569903801063",
  appId: "1:569903801063:web:8803775254bc8377d6f842",
  measurementId: "G-4594TS7DFY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app); // 2. You are missing this export