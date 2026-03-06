import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

 const firebaseConfig = {
    apiKey: "AIzaSyAmYp4oZYgVSuOe-d0sd5VndyrOAunirhY",
    authDomain: "soslive-f7513.firebaseapp.com",
    projectId: "soslive-f7513",
    storageBucket: "soslive-f7513.firebasestorage.app",
    messagingSenderId: "1043689888340",
    appId: "1:1043689888340:web:45767b37d8b27e25682bc1"

  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

