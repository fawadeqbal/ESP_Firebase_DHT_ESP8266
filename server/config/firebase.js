// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, query, orderByChild, startAt, endAt, limitToLast, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTwqLXb5pYqNM1FEWk4lwZ74oi3AuIz3c",
  authDomain: "enviroment-controll.firebaseapp.com",
  databaseURL: "https://enviroment-controll-default-rtdb.firebaseio.com",
  projectId: "enviroment-controll",
  storageBucket: "enviroment-controll.firebasestorage.app",
  messagingSenderId: "873516067013",
  appId: "1:873516067013:web:d118640458041053e1e8ac"
};

// Initialize Firebase client SDK
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, query, orderByChild, startAt, endAt, limitToLast, onValue }; 