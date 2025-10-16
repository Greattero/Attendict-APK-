import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {

};

// ✅ Only initialize if no apps exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export database instance
export const db = getDatabase(app);
