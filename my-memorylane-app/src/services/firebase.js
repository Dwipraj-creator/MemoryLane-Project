import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getDatabase} from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBoBVGNKDHJvilUF8NlB9KUBmTBVHTTuYE",
  authDomain: "loginuser-1d9fc.firebaseapp.com",
  databaseURL: "https://loginuser-1d9fc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loginuser-1d9fc",
  storageBucket: "loginuser-1d9fc.firebasestorage.app",
  messagingSenderId: "92170099811",
  appId: "1:92170099811:web:31bc1baa169f7c3beaec56",
  measurementId: "G-W9GRV65YET"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
