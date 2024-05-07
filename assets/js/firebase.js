/*=========
Firebaseの設定
==========*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
// RealtimeDatabase
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, onValue  } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// Autentication
import { getAuth,signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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

/* GoogleAuth*/
const provider = new GoogleAuthProvider();
const auth = getAuth();

/*Googleログイン処理*/
//https://firebase.google.com/docs/auth/web/google-signin?hl=ja
$("#login").on('click',function(){
    signInWithPopup(auth, provider)
    .then((result) => {
      location.href="./login.html";
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    }).catch((error) => {
      const errorCode = error.code;
      errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
});

  /*ログアウト処理*/
  $("#logout").on('click',function(){
    signOut(auth).then(()=>{
    location.href="./index.html";
  }).catch((error)=>{
    console.log(error);
  });
  });
  /*ユーザー名の取得*/
  onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    if(user !==null){
      const namae =user.displayName;
      console.log(namae);
      $("#username").text(namae);
    }
  }
});

/*Database*/
/*rule→閲覧は自由にできる、書き込みはログインユーザーのみ*/
const db = getDatabase(app);
const dbRef = ref(db, "chat");

/*クリックイベントによるDatabaseへの登録*/
$("#submit").on("click",function(){
  let time = Date.now();
  let today = Date(time);
  //データとして渡すオブジェクトの定義
  const post = {
    text:$("#text").val(),
    time:today,
    username:$("#username").text()
    }  
  //データベースのノード作成と書き込み
  const newPostRef= push(dbRef);
  set(newPostRef,post);
 //textareaのリセット
  $("#text").val("");
  // location.reload();
});

/*Postフォーマットの関数式*/
function format (key,post){
  const postframe = document.createElement('div');
  postframe.className = 'post';
  postframe.setAttribute("id",key);
  const postname = document.createElement('p');
  postname.className='postName';
  postname.textContent = post.username;
  const posttime = document.createElement('p');
  posttime.className = 'postTime';
  posttime.textContent = post.time;
  const posttext = document.createElement('p');
  posttext.className = 'postText';
  posttext.textContent = post.text;
  //構造化
  postframe.appendChild(postname);
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
});