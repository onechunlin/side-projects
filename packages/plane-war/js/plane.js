window.onload = function () {
  // 获取ID元素
  function $(idName) {
    return document.getElementById(idName);
  }
  // 获取需要使用的标签元素
  let game = $("game"),
    gameStart = $("game-start"),
    gameEnter = $("game-enter"),
    myPlane = $("my-plane"),
    bullets = $("bullets"),
    enemys = $("enemys"),
    scoreWrapper = $("score");
  // 获取需要用到的数值
  let gameW = game.offsetWidth,
    gameH = game.offsetHeight,
    gameOffsetLeft = game.offsetLeft,
    gameOffsetTop = game.offsetTop,
    myPlaneW = 66,
    myPlaneH = 80,
    bulletW = 6,
    bulletH = 14,
    gameStatus = false,
    createBulletsTimer = null, //创建子弹的定时器
    createEnemysTimer = null, //创建敌机的定时器
    bgMoveTimer = null, //背景图的定时器
    //所有子弹元素的集合
    nowBullet = [],
    //所有敌机元素的集合
    nowEnemy = [],
    //背景图Y轴的值
    backgroundPY = 0,
    score = 0,
    gameOver = false;
  //开始游戏
  gameStart.firstElementChild.onclick = function () {
    gameStart.style.display = "none";
    gameEnter.style.display = "block";
    //给当前文档添加键盘事件
    document.onkeyup = function (e) {
      let event = e || window.event;
      //按下空格键
      if (event.keyCode == 32) {
        if (!gameStatus) {
          if (gameOver) {
            //初始化
            score = 0;
            gameOver = false;
          }
          gameStatus = true;
          game.onmousemove = myPlaneMove;
          //背景图的运动
          bgMove();
          //创建子弹
          shot();
          //创建敌机
          appearEnemys();
          //暂停游戏之后的开始游戏
          //子弹的继续运动
          if (nowBullet.length > 0) {
            restart(nowBullet, 1);
          }
          //敌机的继续运动
          if (nowEnemy.length > 0) {
            restart(nowEnemy);
          }
        } else {
          gameStatus = false;
          game.onmousemove = null;
          //清除创建子弹的定时器
          clearInterval(createBulletsTimer);
          createBulletsTimer = null;
          //清除创建敌机的定时器
          clearInterval(createEnemysTimer);
          createEnemysTimer = null;
          //清除背景移动的定时器
          clearInterval(bgMoveTimer);
          bgMoveTimer = null;
          //清除所有子弹和敌机的运动定时器
          clearTimer(nowBullet.concat(nowEnemy));
        }
      }
    };
  };
  //飞机移动
  function myPlaneMove(e) {
    let event = e || window.event;

    myPlane.style.left = event.x - gameOffsetLeft - myPlaneW / 2 + "px";
    myPlane.style.top = event.y - gameOffsetTop - myPlaneH / 2 + "px";
    if (parseInt(myPlane.style.left) < 0) {
      myPlane.style.left = 0;
    } else if (parseInt(myPlane.style.left) > gameW - myPlaneW) {
      myPlane.style.left = gameW - myPlaneW + "px";
    }
    if (parseInt(myPlane.style.top) < 0) {
      myPlane.style.top = 0;
    } else if (parseInt(myPlane.style.top) > gameH - myPlaneH) {
      myPlane.style.top = gameH - myPlaneH + "px";
    }
  }
  //单位时间内创建子弹
  function shot() {
    if (createBulletsTimer) {
      return;
    }
    createBulletsTimer = setInterval(() => {
      //创建子弹
      createBullet();
      //子弹的移动
    }, 200);
  }
  //创建子弹
  function createBullet() {
    let bullet = new Image();
    bullet.src = "images/bullet1.png";
    bullet.className = "bullet";
    //确定子弹的位置
    //创建每颗子弹需要确定飞机的位置
    let bulletL = myPlane.offsetLeft + myPlaneW / 2 - bulletW / 2;
    let bulletT = myPlane.offsetTop - bulletH;
    bullet.style.left = bulletL + "px";
    bullet.style.top = bulletT + "px";
    bullets.appendChild(bullet);
    nowBullet.push(bullet);
    move(bullet);
  }
  //子弹的匀速运动
  function move(bullet) {
    let speed = -8;
    bullet.timer = setInterval(() => {
      let bulletT = bullet.offsetTop;
      if (bulletT < -bulletH) {
        clearInterval(bullet.timer);
        bullets.removeChild(bullet);
        nowBullet.shift();
      } else {
        bullet.style.top = bulletT + speed + "px";
      }
    }, 16);
  }
  //创建敌机数据对象
  let enemyObj = {
    enemy1: {
      width: 34,
      height: 24,
      score: 100,
      hp: 100,
    },
    enemy2: {
      width: 46,
      height: 60,
      score: 500,
      hp: 500,
    },
    enemy3: {
      width: 110,
      height: 164,
      score: 1000,
      hp: 1000,
    },
  };
  //创建敌机的定时器
  function appearEnemys() {
    if (createEnemysTimer) return;
    createEnemysTimer = setInterval(() => {
      //制造敌机
      createEnemy();
    }, 1000);
  }
  //制造敌机
  function createEnemy() {
    //敌机出现的概率  1代表小敌机，2代表中敌机，3代表大敌机
    let percentData = [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3,
    ];
    //敌机的类型
    let enemyType = percentData[Math.floor(Math.random() * percentData.length)];
    //得到当前敌机的数据
    let enemyData = enemyObj["enemy" + enemyType];
    let enemy = new Image(enemyData.width, enemyData.height);
    enemy.src = `images/enemy${enemyType}.png`;
    enemy.score = enemyData.score;
    enemy.hp = enemyData.hp;
    enemy.type = enemyType;
    //确定当前敌机出现时的位置
    let enemyL = Math.floor(Math.random() * (gameW - enemyData.width + 1));
    let enemyT = -enemyData.height;
    enemy.className = "enemy";
    enemy.dead = false;
    enemy.style.left = enemyL + "px";
    enemy.style.top = enemyT + "px";

    enemys.appendChild(enemy);
    nowEnemy.push(enemy);
    enemyMove(enemy);
  }
  //敌机的运动
  function enemyMove(enemy) {
    let speed = null;
    switch (enemy.type) {
      case 1:
        speed = 3;
        break;
      case 2:
        speed = 2;
        break;
      case 3:
        speed = 1;
        break;
      default:
        speed = 1;
        break;
    }
    enemy.timer = setInterval(() => {
      let enemyT = enemy.offsetTop;
      if (enemyT >= gameH) {
        clearInterval(enemy.timer);
        enemys.removeChild(enemy);
        nowEnemy.shift();
      } else {
        enemy.style.top = enemyT + speed + "px";
        //检测敌机和所有子弹的碰撞
        collision(enemy);
        //检测游戏是否结束
        isGameOver(enemy);
      }
    }, 16);
  }
  //清除所有敌机和所有的子弹的定时器
  function clearTimer(childs) {
    childs.forEach((item) => {
      clearInterval(item.timer);
    });
  }
  //暂停游戏后的开始游戏
  function restart(childs, type) {
    childs.forEach((item) => {
      type == 1 ? move(item) : enemyMove(item);
    });
  }
  //开始游戏之后的背景图的运动
  function bgMove() {
    bgMoveTimer = setInterval(() => {
      backgroundPY += 1;
      if (backgroundPY >= gameH) {
        backgroundPY = 0;
      }
      gameEnter.style.backgroundPositionY = backgroundPY + "px";
    }, 16);
  }
  //检测敌机和所有子弹的碰撞
  function collision(enemy) {
    nowBullet.forEach((item, index) => {
      //得到子弹的左上边距
      let bulletL = item.offsetLeft,
        bulletT = item.offsetTop;
      //得到敌机的左上边距
      let enemyL = enemy.offsetLeft,
        enemyT = enemy.offsetTop;
      //得到敌机的宽高
      let enemyW = enemy.width,
        enemyH = enemy.height;
      let codition =
        bulletL + bulletW > enemyL &&
        bulletL < enemyL + enemyW &&
        bulletT < enemyT + enemyH &&
        bulletT + bulletH > enemyT;

      if (codition) {
        //子弹和敌机的碰撞

        //清除子弹的定时器
        clearInterval(item.timer);
        //DOM结点中删除元素
        item.parentNode.removeChild(item);
        //从集合中删除元素
        nowBullet.splice(index, 1);
        //子弹和敌机碰撞时减少敌机血量，当敌机血量为0时，删除敌机
        enemy.hp -= 100;
        if (enemy.hp == 0) {
          //清除敌机的定时器
          clearInterval(enemy);
          //替换爆炸图片
          enemy.src = `images/bz${enemy.type}.gif`;
          //标记死亡敌机
          enemy.dead = true;
          //得分
          score += enemy.score;
          scoreWrapper.innerHTML = `得分: ${score}`;
          //延时删除集合和文档中的死亡敌机
          setTimeout(() => {
            delEnemy(enemy);
          }, 250);
        }
      }
    });
  }

  function delEnemy(item) {
    if (item.parentNode) {
      let index = nowEnemy.indexOf(item);
      //从文档中删除敌机
      item.parentNode.removeChild(item);
      //从集合中删除敌机
      nowEnemy.splice(index, 1);
    }
  }
  //判断游戏是否结束
  function isGameOver() {
    nowEnemy.forEach((item) => {
      if (!item.dead) {
        //得到我的飞机的左上边距
        let myPlaneL = myPlane.offsetLeft,
          myPlaneT = myPlane.offsetTop;
        //得到我的飞机的宽高
        //得到敌机的左上边距
        let enemyL = item.offsetLeft,
          enemyT = item.offsetTop;
        //得到敌机的宽高
        let enemyW = item.offsetWidth,
          enemyH = item.offsetWidth;
        let codition =
          myPlaneL + myPlaneW > enemyL &&
          myPlaneL < enemyL + enemyW &&
          myPlaneT < enemyT + enemyH &&
          myPlaneT + myPlaneH > enemyT;
        if (codition) {
          //己方飞机和敌方飞机相撞
          //清除定时器
          clearInterval(createBulletsTimer);
          clearInterval(createEnemysTimer);
          clearInterval(bgMoveTimer);
          createBulletsTimer = null;
          createEnemysTimer = null;
          bgMoveTimer = null;

          //删除所有子弹和敌机
          nowBullet.forEach((item) => {
            if (item.parentNode) {
              clearInterval(item.timer);
              item.parentNode.removeChild(item);
            }
          });
          nowEnemy.forEach((item) => {
            clearInterval(item.timer);
            item.parentNode.removeChild(item);
          });
          nowBullet = [];
          nowEnemy = [];

          //清除己方飞机的移动事件
          game.onmousemove = null;
          //替换爆炸图片
          myPlane.src = "images/bz.gif";
          setTimeout(() => {
            myPlane.src = "images/my.gif";
            gameEnter.style.display = "none";
            gameStart.style.display = "block";
            alert("游戏结束！");
            myPlane.style.left = "127px";
            myPlane.style.top = gameH - myPlaneH + "px";
            score = 0;
            scoreWrapper.innerHTML = `得分: ${score}`;
          }, 500);
        }
      }
    });
  }
};
