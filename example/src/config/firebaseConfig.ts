import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";

export const firebaseConfig = {
  apiKey: "AIzaSyDXX9cAwpXJRfMgjcj4RaHmhE7siwDE0y0",
  authDomain: "lgap-e06f6.firebaseapp.com",
  databaseURL: "https://lgap-e06f6.firebaseio.com",
  projectId: "lgap-e06f6",
  storageBucket: "lgap-e06f6.appspot.com",
  messagingSenderId: "58384471558",
  appId: "1:58384471558:web:71cb1804dc817836065587",
  measurementId: "G-XQ2BYZ10Y6"
};

// INITIALIZE Firebase
const app = initializeApp(firebaseConfig);

// INITIALIZE Firebase's Default auth
let userAuth: firebaseAuth.Auth; 
if (Platform.OS === 'ios') {
  // iOS environment
  const firebaseAuthWithPersistence = firebaseAuth as any; 
  if (firebaseAuthWithPersistence.getReactNativePersistence) {
    const reactNativePersistence = firebaseAuthWithPersistence.getReactNativePersistence;
    userAuth = firebaseAuth.initializeAuth(app, {
      persistence: reactNativePersistence(AsyncStorage),
    });
  } 
} else {
  // Web environment
  userAuth = firebaseAuth.getAuth(app);
}

// INITIALIZE Database
const realtimeDB = getDatabase(app);

export { userAuth, realtimeDB };
