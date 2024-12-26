import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDGIssOMMAI-YXZ7J-_TkQedN0k9UMEi7E",
    authDomain: "novel-app-60f99.firebaseapp.com",
    projectId: "novel-app-60f99",
    storageBucket: "novel-app-60f99.firebasestorage.app",
    messagingSenderId: "926865169325",
    appId: "1:926865169325:web:105b64aa0a1bfe4f881f24",
    measurementId: "G-GM7GPF1EZB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
