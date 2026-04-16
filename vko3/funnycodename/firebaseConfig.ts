import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBlJqlIflyLzQAf_UJ5GOjHJG8hGgbQn7w",
  authDomain: "vite-webpilvi.firebaseapp.com",
  projectId: "vite-webpilvi",
  storageBucket: "vite-webpilvi.firebasestorage.app",
  messagingSenderId: "731985893670",
  appId: "1:731985893670:web:247f2904914b49107289e7"
};

const app = initializeApp(firebaseConfig);

export default app;