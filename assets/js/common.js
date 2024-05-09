  /*==========
  可変テキストボックス
  ==========*/

  function tBoxResize(){
    const tBox = document.getElementById("text");
    tBox.style.height = 'auto'; //heightの再読み込みして初期化
    let box = tBox.scrollHeight;
    tBox.style.height= `${box}px`;
  }

