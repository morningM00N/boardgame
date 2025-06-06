let money = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9]

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

let moneyIndex = 0;
shuffle(money);
let curRound = 0;

function funcSetMoney() {
  if (curRound == 0) {
    let answer = confirm("게임을 시작하시겠습니까?");
    if (answer == false) {
      return;
    }
  } else if (curRound == 5) {
    return
  } else {
    let answer = confirm("다음 라운드를 시작하시겠습니까?");
    if (answer == false) {
      return;
    }
  }
  curRound += 1;
  let btnGameStart = document.getElementById("btnGameStart");
  btnGameStart.innerHTML = "현재 라운드 : " + curRound + "   (다음 라운드 시작)";

  const elements = document.getElementsByClassName("money-stack");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    while (element.hasChildNodes()) {
      element.removeChild(element.firstChild);
    }
  }
  let assigned = [[], [], [], [], [], []]

  for (let i = 0; i < assigned.length; i++) {
    let curMoney = 0
    while (curMoney < 5) {
      curMoney += money[moneyIndex];
      assigned[i].push(money[moneyIndex]);
      moneyIndex++;
      if (moneyIndex >= money.length) {
        shuffle(money);
        moneyIndex = 0;
      }
    }
  }
  for (let i = 0; i < assigned.length; i++) {
    for (let j = 0; j < assigned[i].length; j++) {
      const img = document.createElement("img");
      img.id = "img" + i + j;
      img.src = "https://raw.githubusercontent.com/morningM00N/boardgame/refs/heads/main/img/lasvegas/" + assigned[i][j] + ".png";
      img.alt = "" + assigned[i][j] + "0,000";
      elements[i].appendChild(img);
    }
  }
  setTimeout(function () {
    for (let i = 0; i < assigned.length; i++) {
      const boundingBox = elements[i].getBoundingClientRect();
      const leftDelta = boundingBox.left
      for (let j = 0; j < assigned[i].length; j++) {
        const img = document.getElementById("img" + i + j);
        img.style.position = "absolute";
        img.style.transition = "transform 0.5s ease"
        img.style.top = "0px"
        img.style.left = ""+(0-leftDelta)+"px"
        setTimeout(function(){
          img.style.transform = "translate("+leftDelta+"px," + (boundingBox.height/3*j) + "px)";
        },50)
      }
    }
  }, 50)
}

function funcFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

//funcSetMoney()
