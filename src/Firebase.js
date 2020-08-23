import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCUGFGYlpC5OgB_ifKBzJH_rbuMCLNdj-Q",
  authDomain: "whatsapp-clone-3b9f7.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-3b9f7.firebaseio.com",
  projectId: "whatsapp-clone-3b9f7",
  storageBucket: "whatsapp-clone-3b9f7.appspot.com",
  messagingSenderId: "931334847694",
  appId: "1:931334847694:web:ab523f5a8f35d556eb649f",
  measurementId: "G-96KKL9C57B",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
