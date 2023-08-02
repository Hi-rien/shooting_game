// 캔버스 세팅
let canvas
let ctx

canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")

canvas.width = 400
canvas.height = 700
document.body.appendChild(canvas)



// 이미지 변수
let backgroundImg, spaceImg, bulletImg, enemyImg, gameOverImg

// true면 게임이 끝나도록 초기값 false
let gameOver = false

let score = 0

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 30
let spaceshipY = canvas.height - 60

// 총알 저장 리스트
let bulletList = []

// 총알 좌표
function Bullet() {
  this.x = 0
  this.y = 0

  this.init = function () {
    this.x = spaceshipX + 20
    this.y = spaceshipY - 25
    this.alive = true

    bulletList.push(this)
  }

  this.update = function () {
    this.y -= 7
  }

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 32) {
        score++
        this.alive = false
        enemyList.splice(i, 1)
      }
    }

  }
}

// 적군 랜덤 좌표 값
function generateRanom(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNum
}

let enemyList = []

// 적군 좌표
function enemy() {
  this.x = 0
  this.y = 0

  this.init = function () {
    this.y = 0
    this.x = generateRanom(30, canvas.width - 50)

    enemyList.push(this)
  }

  // 적군 내려오기
  this.update = function () {
    if (score > 10) {
      this.y += 1
    }
    if (score > 20) {
      this.y += 1
    }
    if (score > 30) {
      this.y += 1
    }
    this.y += 2

    if (this.y >= canvas.height - 32) {
      gameOver = true
    }
  }
}

// 이미지 불러오기
function loadImage() {
  backgroundImg = new Image();
  backgroundImg.src = "img/back.png"

  spaceImg = new Image();
  spaceImg.src = "img/space.png"

  bulletImg = new Image();
  bulletImg.src = "img/bullet.png"

  enemyImg = new Image();
  enemyImg.src = "img/enemy.png"

  gameOverImg = new Image();
  gameOverImg.src = "img/game_over.jpg"
}

// 방향키 눌렀을 때 우주선 이동
let keysDown = {}

function setupKeyboardListener() {
  document.addEventListener('keydown', function (event) {
    keysDown[event.keyCode] = true
  })

  document.addEventListener('keyup', function (event) {
    delete keysDown[event.keyCode]

    // 스페이스바 누르면 총알생성 함수 실행
    if (event.keyCode == 32) {
      createBullet()
    }
  })
}

// 총알 생성
function createBullet() {
  let b = new Bullet()
  b.init()
}

// 적군생성
function createEnemy() {
  const interval = setInterval(function () {
    let e = new enemy()
    e.init()
  }, 1000)
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5
  }
  if (37 in keysDown) {
    spaceshipX -= 5
  }

  // 화면 밖으로 나가지 못하게
  if (spaceshipX <= 0) {
    spaceshipX = 0
  }
  if (spaceshipX > canvas.width - 60) {
    spaceshipX = canvas.width - 60
  }

  // 총알 y 좌표 업데이트 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update()
      bulletList[i].checkHit()
    }
  }

  // 적군 값 업데이트 호출
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update()
  }
}

// 이미지 그리기
function render() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(spaceImg, spaceshipX, spaceshipY)
  ctx.fillText(`SOCRE: ${score}`, 20, 40)
  ctx.fillStyle = 'white'
  ctx.font = "20px Arial"

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImg, bulletList[i].x, bulletList[i].y, 20, 30)
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImg, enemyList[i].x, enemyList[i].y)
  }
}



// function inputScore() {
//   let name = prompt(`점수는 ${score}점 입니다. 이름을 입력하세요`)

//   pushScore(name)
// }


// let userName = []
// let userScore = []

// function pushScore(name) {

//   userName.push(name)
//   userScore.push(score)

//   for(let i = 0; i < localStorage.userName.length; i++) { 
//     document.querySelector('.scroe').insertAdjacentHTML('beforebegin', `<li class="scroe_name">${userName[i]} ${userScore[i]}점</li>`)
//   }
// }

// 이미지 뿌리기
function main() {

  if (!gameOver) {
    update()
    render()
    requestAnimationFrame(main)
  } else {
    ctx.drawImage(gameOverImg, 10, 150, 380, 300)
    // inputScore()
  }
}



document.getElementById('start').onclick = function () {
  document.getElementById('start_back').style.display = 'none'
  loadImage()
  main()
  createEnemy()
  setupKeyboardListener()
}
