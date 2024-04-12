// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';//conexion 
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqnctP9dsSucQ0GkzlV5bmcq0T04jG4dI",
    authDomain: "prestamos-9f759.firebaseapp.com",
    projectId: "prestamos-9f759",
    storageBucket: "prestamos-9f759.appspot.com",
    messagingSenderId: "13371750969",
    appId: "1:13371750969:web:90f7c9e7212d1b851a2be8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth();
export {auth,app};
//insertar
const appinsert = initializeApp(firebaseConfig);
const db=getFirestore(appinsert);
export {db};