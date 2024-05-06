'use strict';
/*=========
Firebaseの設定
==========*/
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
  // RealtimeDatabase
  import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, onValue  } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
  // Autentication


  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD084xtONTFcO5v3_bY6H4jtMVlBaGkyuQ",
    authDomain: "chatpr-f9896.firebaseapp.com",
    projectId: "chatpr-f9896",
    storageBucket: "chatpr-f9896.appspot.com",
    messagingSenderId: "132773649127",
    appId: "1:132773649127:web:76f35dd55dd8af47b5e042"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  /*==========
  Database
  ==========*/