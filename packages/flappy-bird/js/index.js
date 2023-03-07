let birdTimer = null;
let pipeTimer = null;
let AnimationTimer = null;
let iSpeedY = 0;
let g = 1;
let spaceHeight = innerHeight * 0.3;
let die = false;
let count = 0;

function playGame() {
  document.body.removeChild(window["start-panel"]);
  let tmpCount = 3;
  tip.style.visibility = "visible";
  //倒计时的提示
  let tipTimer = setInterval(() => {
    second.innerText = tmpCount;
    tmpCount--;
    if (tmpCount < 0) {
      document.body.removeChild(tip);
      pipeCount.style.visibility = "visible";
      clearInterval(tipTimer);
    }
  }, 1000);
  //提示三秒后开启游戏，实际开始是点击开始后四秒
  let tmpTimer = setTimeout(() => {
    clearTimeout(tmpTimer);
    startGame();
  }, 4000); //这为什么是四秒可以自己尝试一下
}

function startGame() {
  //让小鸟能够起飞
  clearInterval(birdTimer);
  birdTimer = setInterval(birdFly, 30);
  //生成管子
  clearInterval(pipeTimer);
  pipeTimer = setInterval(createG, 1000);
  //开始管子的移动
  startPipeAnimation();
  //添加键盘事件
  window.onkeydown = (event) => {
    if (die) return;
    iSpeedY -= 25;
  };
  window.onmousedown = (event) => {
    if (die) return;
    iSpeedY -= 25;
  };
}

// 让小鸟飞的函数
function birdFly() {
  iSpeedY += g;
  let t = bird.offsetTop + iSpeedY;
  if (t < 0 || t > innerHeight - bird.offsetHeight) {
    die = true;
    iSpeedY = 0;
  }
  if (die) {
    clearInterval(birdTimer);
    clearInterval(pipeTimer);
    clearInterval(AnimationTimer);
    if (count < 10) {
      alert(`才${count}个，加加油哦`);
    } else if (count >= 10 && count < 20) {
      alert(`${count}个，也还行了，毕竟这只是简单难度`);
    } else if (count >= 20 && count < 50) {
      alert(`${count}个，不过离我还是有点距离`);
    } else {
      alert("虽死犹荣！");
    }
    location.reload();
  }
  bird.style.top = t + "px";
}

// 检测objA和objB是否碰撞
function setBoom(objA, objB) {
  let objALeft = objA.offsetLeft;
  let objARight = objA.offsetLeft + objA.offsetWidth;
  let objATop = objA.offsetTop;
  let objABottom = objA.offsetTop + objA.offsetHeight;

  let objBLeft = objB.offsetLeft;
  let objBRight = objB.offsetLeft + objB.offsetWidth;
  let objBTop = objB.offsetTop;
  let objBBottom = objB.offsetTop + objB.offsetHeight;

  if (
    objARight > objBLeft &&
    objABottom > objBTop &&
    objALeft < objBRight &&
    objATop < objBBottom
  ) {
    return true;
  } else {
    return false;
  }
}

// 生成min - max的随机数
function random(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}

// 创建管子
function createG() {
  let topDiv = document.createElement("div");
  topDiv.className = "top-g";
  let topHeight = random(innerHeight * 0.1, innerHeight * 0.6);
  topDiv.style.height = topHeight + "px";
  topDiv.leftData = 100;
  topDiv.firstCount = true;

  let bottomDiv = document.createElement("div");
  bottomDiv.className = "bottom-g";
  bottomDiv.style.height = innerHeight - topHeight - spaceHeight + "px";
  bottomDiv.leftData = 100;

  document.body.appendChild(topDiv);
  document.body.appendChild(bottomDiv);
}

// 开始管子的动画
function startPipeAnimation() {
  AnimationTimer = setInterval(() => {
    let allTopG = document.querySelectorAll(".top-g");
    let allBottomG = document.querySelectorAll(".bottom-g");
    for (let i = 0; i < allTopG.length; i++) {
      if (setBoom(bird, allTopG[i]) || setBoom(bird, allBottomG[i])) {
        die = true;
        break;
      }
      if (allTopG[i].leftData <= -10) {
        document.body.removeChild(allTopG[i]);
        document.body.removeChild(allBottomG[i]);
        continue;
      }
      if (
        allTopG[i].offsetLeft < innerWidth / 2 - 15 &&
        allTopG[i].firstCount
      ) {
        allTopG[i].firstCount = false;
        count++;
        pipeCount.innerText = count;
      }
      allTopG[i].style.left = allTopG[i].leftData + "%";
      allTopG[i].leftData = allTopG[i].leftData - 0.5;

      allBottomG[i].style.left = allBottomG[i].leftData + "%";
      allBottomG[i].leftData = allBottomG[i].leftData - 0.5;
    }
  }, 16);
}
