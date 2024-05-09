/*==========
グローバル変数
==========*/
let like = 0;

/*=========
Firebaseの設定
==========*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
// RealtimeDatabase
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, onValue  } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// Autentication
import { getAuth,signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
//Storage
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
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
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // const user = result.user;
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

//ファイルをStorageに置く設定
const storage = getStorage(app);
$("#input-files").on("change", function(e) {
  const file = e.target.files[0];
  const storageRef = sRef(storage, 'images/' + file.name); // 'images/'は任意のパス
  uploadBytes(storageRef, file).then((snapshot) => {
  console.log('Uploaded a blob or file!');
  });
}); 



/*Database*/
/*rule→閲覧は自由にできる、書き込みはログインユーザーのみ*/
const db = getDatabase(app);
const dbRef = ref(db, "chat");


/*クリックイベントによるDatabaseへの登録*/ 
$("#submit").on("click",async function(){
  //画像取得の処理
  let imageUrl = "";
  if (document.getElementById('input-files').files.length > 0) {
    const file = document.getElementById('input-files').files[0];
    const storageRef = sRef(storage, 'images/' + file.name);
    try{
      const snapshot = await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file and getting download URL', error);
    }
  }

  let time = Date.now();
  let today = Date(time);
  //データとして渡すオブジェクトの定義
  const post = {
    text:$("#text").val(),
    time:today,
    username:$("#username").text(),
    image:imageUrl
    }  
  //データベースのノード作成と書き込み
  const newPostRef= push(dbRef);
  set(newPostRef,post);
 //textareaなどのリセット
  $("#text").val("");
  $("#input-files").val("");
});

/*==========
formatの関数式
1.フレームとして下記を生成
<div id = key class="post">
  <p class="postName"></P>
  <p class="postTime"></P>
  <p class="postText"></P>
</div>
2.各要素のテクストにオブジェクト変数post(onChildAddedで「data.val()」として定義)の各値を入れる
==========*/

function format (key,post){
  // 枠組みの要素の生成
  //大枠のdiv
  const postframe = document.createElement('div');
  postframe.className = 'post';
  postframe.setAttribute("id",key);
  
  //ユーザーネームとheartを囲うdiv
  const postnameFrame =document.createElement('div');
  postnameFrame.className='postNameFrame';
  //ユーザーネームを記述するpタグ
  const postname = document.createElement('p');
  postname.className='postName';
  postname.textContent = post.username;
  //heartArea
  const heartarea = document.createElement('div');
  heartarea.className='heartArea';
  //heartマークの大枠
  const heartbox = document.createElement('div');
  heartbox.className='heartBox';
  //heartマーク
  const heartCore = document.createElement('p');
  heartCore.className='core';
  //heartカウント
  const heartCount = document.createElement('p');
  heartCount.className='heartCount';
  heartCount.textContent = 0;
  // 投稿時間を記述するpタグ
  const posttime = document.createElement('p');
  posttime.className = 'postTime';
  posttime.textContent = post.time;
  //投稿内容を記述するpタグ
  const posttext = document.createElement('p');
  posttext.className = 'postText';
  posttext.textContent = post.text;
    //構造化
    heartbox.appendChild(heartCore);
    heartarea.appendChild(heartbox);
    heartarea.appendChild(heartCount);
    postnameFrame.appendChild(postname);
    postnameFrame.appendChild(heartarea);
    postframe.appendChild(postnameFrame);
    postframe.appendChild(posttime);
    postframe.appendChild(posttext);
  //imageタグの追加
  if(post.image !== "" ){
  const postImage = document.createElement('img');
  postImage.className = 'postImage';
  const imagePass = post.image;
  postImage.setAttribute('src',imagePass);
  postframe.appendChild(postImage);
  }

  //該当箇所のhtmlに挿入
  const inserted = document.getElementById("postBox");
  inserted.prepend(postframe);

  //addEventListenerの設定
  document.querySelector('.heartBox').addEventListener('click',function(){
    const core = document.querySelector('.core');
    core.classList.toggle('active');
    if (core.classList.contains('active')) {
      const count = document.querySelector('.heartCount');
      let likeNow = Number(count.textContent);
      likeNow ++;
      count.textContent = likeNow;
      like = likeNow;
    } else {
      const count = document.querySelector('.heartCount');
      let likeNow = Number(count.textContent);
      likeNow --;
      count.textContent = likeNow;
      like = likeNow;
    }
  });
}

function likedb (){
  const dbRef2 = ref(db,"like");
  const newdbRef2=push(dbRef2);
  const heartCount = document.querySelector(".heartCount").textContent;
  console.log(heartCount);
  const likeCount = Number(heartCount);
  console.log(likeCount);
  set(newdbRef2,likeCount);
}
/*==========
onChildAddedでデータの取得とformatの実行
==========*/
onChildAdded(dbRef,function(data){
  const key = data.key;
  const post = data.val();
  format(key,post);
  likedb();
});