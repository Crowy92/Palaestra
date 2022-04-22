// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQc1bEKp9icYJCcXUAxSdZ5v-_oGAMJ5c",
    authDomain: "palaestra-3801e.firebaseapp.com",
    projectId: "palaestra-3801e",
    storageBucket: "palaestra-3801e.appspot.com",
    messagingSenderId: "345383452421",
    appId: "1:345383452421:web:5eba7db0b821fea0e9416c",
    measurementId: "G-V9GB28Q816"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

const db = getFirestore(firebaseApp);

export default db;