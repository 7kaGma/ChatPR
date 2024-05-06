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
const db = getDatabase(app);
const dbRef = ref(db, "chat");

/*クリックイベントによるDatabaseへの登録*/
$("#submit").on("click",function(){
  let time = Date.now();
  let today = Date(time);
  //データとして渡すオブジェクトの定義
  const post = {
    text:$("#text").val(),
    time:today
  }  
  //データベースのノード作成と書き込み
  const newPostRef= push(dbRef);
  set(newPostRef,post);
 //textareaのリセット
  $("#text").val("");
});

/*Postフォーマットの関数式*/
function format (key,post){
  const postframe = document.createElement('div');
  postframe.className = 'post';
  postframe.setAttribute("id",key);
  const posttime = document.createElement('p');
  posttime.className = 'postTime';
  posttime.textContent = post.time;
  const posttext = document.createElement('p');
  posttext.className = 'postText';
  posttext.textContent = post.text;
  //構造化
  postframe.appendChild(posttime);
  postframe.appendChild(posttext);
  //挿入
  const inserted = document.getElementById("postBox");
  inserted.prepend(postframe);
}

/*データの取得*/
onChildAdded(dbRef,function(data){
  const key = data.val();
  const post = data.val();
  format(key,post);
})
