import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyBOo8bFfCwUUsgLXXwOUqDWgppAqHCCOBM",
	authDomain: "undercover-sonnet.firebaseapp.com",
	projectId: "undercover-sonnet",
	storageBucket: "undercover-sonnet.appspot.com",
	messagingSenderId: "623301090821",
	appId: "1:623301090821:web:3e2fb8cfc717413f0d066c",
	databaseURL:
		"https://undercover-sonnet-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
