import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjmPxeXrD3vP5CR4sEz_0AtMj3Y5PUHjY",
  authDomain: "videogametrivia-49db3.firebaseapp.com",
  projectId: "videogametrivia-49db3",
  storageBucket: "videogametrivia-49db3.appspot.com",
  messagingSenderId: "1099053490408",
  appId: "1:1099053490408:web:12a465322fffc8816fe95d",
  measurementId: "G-P3TXFB30VT"
};

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase};
