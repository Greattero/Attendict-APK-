import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBhIm6wTu61zoPUPuDvpM0cFWq-je0Td0Q",
  authDomain: "school-bus-tracker-840f6.firebaseapp.com",
  databaseURL: "https://school-bus-tracker-840f6-default-rtdb.firebaseio.com",
  projectId: "school-bus-tracker-840f6",
  storageBucket: "school-bus-tracker-840f6.appspot.com",
  messagingSenderId: "392938817411",
  appId: "1:392938817411:web:89934ccbddad111a0a18b6",
  measurementId: "G-8HEM42JYF9",
};

// ✅ Only initialize if no apps exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export database instance
export const db = getDatabase(app);
