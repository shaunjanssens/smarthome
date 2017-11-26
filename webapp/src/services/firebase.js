import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCtmqZt5esskn_FMMbSPWw-svLt1jBDNY0",
  authDomain: "smarthome-9d4f6.firebaseapp.com",
  databaseURL: "https://smarthome-9d4f6.firebaseio.com",
  projectId: "smarthome-9d4f6",
  storageBucket: "smarthome-9d4f6.appspot.com",
  messagingSenderId: "824417930024"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
