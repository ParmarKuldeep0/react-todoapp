import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import MyFirebase from "firebase/compat/app"
import "firebase/compat/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyDwbLPm0lan_3eJk_RzAoGBOfubbGxNcsw",
  authDomain: "todo-5591e.firebaseapp.com",
  projectId: "todo-5591e",
  storageBucket: "todo-5591e.appspot.com",
  messagingSenderId: "307041869918",
  appId: "1:307041869918:web:c61577bb0f5a738dd114cf",
  measurementId: "G-XYSS2GE26P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}
