import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAUjoidToPS4JfOP3Um1JqQ5njcV8BwJEk",
    authDomain: "chat-3f638.firebaseapp.com",
    projectId: "chat-3f638",
    storageBucket: "chat-3f638.appspot.com",
    messagingSenderId: "182926246316",
    appId: "1:182926246316:web:494f7ddd915c274e65ba09",
    measurementId: "G-4PT5K9X2MH"
  };

  let app;
  if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app()
  }

  const db = app.firestore();
  const auth = firebase.auth();
  export {db, auth};