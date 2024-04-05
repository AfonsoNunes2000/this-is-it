import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
 apiKey: "AIzaSyBHcmOa0BfjkaOzF_afetF50msVma3gjIQ",
 authDomain: "iscf-e2939.firebaseapp.com",
 databaseURL: "https://iscf-e2939-default-rtdb.europe-west1.firebasedatabase.app/",
 projectId: "iscf-e2939",
 storageBucket: "iscf-e2939.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Export the app and database instances
export { app, database };
