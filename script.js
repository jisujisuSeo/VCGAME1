const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const gameOverScreen = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");

const finalScore = document.getElementById("finalScore");
const finalBest = document.getElementById("finalBest");

const livesEl = document.getElementById("lives");

const hitSound = document.getElementById("hitSound");


// 상태
let gameState = "start";


// 플레이어
let player;


// 배열
let meteors = [];
let stars = [];


// 키 입력
let leftPressed = false;
let rightPressed = false;


// 게임 데이터
let score = 0;
let best = 0;

let lives = 3;

let invincible = 0;


// 초기화

function init(){

    player={

        x:232,

        y:640,

        width:36,

        height:36,

        speed:9

    };


    meteors=[];

    stars=[];


    for(let i=0;i<80;i++){

        stars.push({

            x:Math.random()*500,

            y:Math.random()*700,

            size:Math.random()*2+1,

            speed:0.5+Math.random()

        });

    }


    score=0;

    lives=3;

    invincible=0;


    best = localStorage.getItem("meteorBest") || 0;


    updateUI();

}




function updateUI(){

    scoreEl.innerText=score;

    bestEl.innerText=best;


    livesEl.innerHTML=

    "❤️".repeat(lives)

    +

    "🤍".repeat(3-lives);

}





// 시작 버튼

startBtn.addEventListener("click",()=>{

    gameState="playing";

    startScreen.style.display="none";

    init();

});




// 다시하기

restartBtn.addEventListener("click",()=>{

    gameState="playing";

    gameOverScreen.classList.add("hidden");

    init();

});






// 키 입력

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowLeft"){

        leftPressed=true;

    }


    if(e.key==="ArrowRight"){

        rightPressed=true;

    }

});




document.addEventListener("keyup",(e)=>{


    if(e.key==="ArrowLeft"){

        leftPressed=false;

    }


    if(e.key==="ArrowRight"){

        rightPressed=false;

    }


});








// 운석 생성

setInterval(()=>{

    if(gameState!=="playing") return;


    meteors.push({

        x:Math.random()*440,

        y:-50,

        radius:18+Math.random()*20,

        speed:3+Math.random()*3,

        passed:false

    });


},550);







// 충돌 판정

function collision(a,b){

const hitBox=6;


return(

a.x+hitBox < b.x+b.radius*2 &&

a.x+a.width-hitBox > b.x &&

a.y+hitBox < b.y+b.radius*2 &&

a.y+a.height-hitBox > b.y

);

}







// 별

function drawStars(){


ctx.fillStyle="white";


stars.forEach(star=>{


star.y += star.speed;


if(star.y>700){

star.y=0;

star.x=Math.random()*500;

}


ctx.fillRect(

star.x,

star.y,

star.size,

star.size

);


});


}









// 우주선

function drawPlayer(){



if(

invincible>0

&&

Math.floor(invincible/5)%2

){

ctx.fillStyle="white";

}

else{

ctx.fillStyle="#22d3ee";

}




ctx.beginPath();

ctx.moveTo(

player.x+18,

player.y

);



ctx.lineTo(

player.x,

player.y+36

);



ctx.lineTo(

player.x+36,

player.y+36

);



ctx.closePath();


ctx.fill();


}










// 운석

function drawMeteors(){


for(let i=meteors.length-1;i>=0;i--){


let m=meteors[i];



m.y +=

m.speed+

score*0.02;



ctx.fillStyle="#f97316";


ctx.beginPath();


ctx.arc(

m.x+m.radius,

m.y+m.radius,

m.radius,

0,

Math.PI*2

);


ctx.fill();





if(

m.y>700

&&

!m.passed

){

m.passed=true;


score++;



if(score>best){


best=score;


localStorage.setItem(

"meteorBest",

best

);


}


updateUI();


}




if(

collision(player,m)

&&

invincible<=0

){


hitSound.currentTime=0;

hitSound.play();


lives--;


invincible=60;


updateUI();



if(lives<=0){


gameState="gameover";


finalScore.innerText=score;


finalBest.innerText=best;


gameOverScreen.classList.remove(

"hidden"

);


}


}



if(m.y>760){

meteors.splice(i,1);

}


}


}









function gameLoop(){


requestAnimationFrame(

gameLoop

);



if(

gameState!=="playing"

){

return;

}



ctx.clearRect(

0,

0,

500,

700

);



drawStars();




if(leftPressed){

player.x-=player.speed;

}



if(rightPressed){

player.x+=player.speed;

}



player.x=Math.max(

0,

Math.min(

464,

player.x

)

);




drawPlayer();


drawMeteors();




if(invincible>0){

invincible--;

}



}



gameLoop();