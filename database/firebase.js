import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyAHatqlMkgwtBwFSrIMA5o2rzmzjtBHllo",
    authDomain: "react-native-firebase-2d7aa.firebaseapp.com",
    projectId: "react-native-firebase-2d7aa",
    storageBucket: "react-native-firebase-2d7aa.appspot.com",
    messagingSenderId: "206190794167",
    appId: "1:206190794167:web:5d1de8a6eaff002e674432"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const stores = firebase.storage()
const storis = firebase.storage
const auth = firebase.auth();
export default {
    firebase,
    db,
    stores,
    auth,
    storis
};


