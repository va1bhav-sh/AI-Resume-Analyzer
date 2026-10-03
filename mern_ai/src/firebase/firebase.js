import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyCwD1tGixsH8LeKwRH70NUuRDZyD8q4L60",
  authDomain: "resumeai-c8d77.firebaseapp.com",
  projectId: "resumeai-c8d77",
  storageBucket: "resumeai-c8d77.firebasestorage.app",
  messagingSenderId: "266597699833",
  appId: "1:266597699833:web:42ebab7474f5fb43a59228",
  measurementId: "G-T12J13VZ0E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);