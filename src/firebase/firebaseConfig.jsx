import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_N1OC0PMbaiPIG6miPpeo2MTJAi_0hpk",
    authDomain: "portfolio-b42c6.firebaseapp.com",
    databaseURL: "https://portfolio-b42c6-default-rtdb.firebaseio.com",
    projectId: "portfolio-b42c6",
    storageBucket: "portfolio-b42c6.firebasestorage.app",
    messagingSenderId: "776253049041",
    appId: "1:776253049041:web:405851d43ed9792ec11df0",
    measurementId: "G-ENV2D6XDL9"
};

// Initialize Firebase
let firebaseApp;
let database;

export const initializeFirebase = () => {
    try {
        if (!firebaseApp) {
            firebaseApp = initializeApp(firebaseConfig);
            database = getDatabase(firebaseApp);
        }
        return database;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
};

export const getFirebaseDatabase = () => {
    if (!database) {
        return initializeFirebase();
    }
    return database;
};