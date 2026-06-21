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


// 게임 상태
let gameState = "start";

// 플레이어
let player;

// 운석
let meteors=[];

// 별
let stars=[];


// 입력
let leftPressed=false;
let rightPressed=false;


// 게임 데이터
let score=0;
let best=0;

let lives=3;

let invincible=0;



// 초기화

function init(){

player={

x:220,

y:620,

width:60,

height:60,

speed:8

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


best=localStorage.getItem("meteorBest") || 0;


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




// 시작

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


x:Math.random()*450,


y:-60,


radius:20+Math.random()*20,


speed:3+Math.random()*3,


passed:false


});


},600);








function collision(a,b){


return(

a.x < b.x+b.radius*2 &&

a.x+a.width > b.x &&

a.y < b.y+b.radius*2 &&

a.y+a.height > b.y

);

}







function drawStars(){


ctx.fillStyle="white";


stars.forEach(star=>{


star.y+=star.speed;


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



// 우주선

ctx.beginPath();


ctx.moveTo(

player.x+30,

player.y

);


ctx.lineTo(

player.x,

player.y+60

);


ctx.lineTo(

player.x+60,

player.y+60

);


ctx.closePath();


ctx.fill();

}








function drawMeteors(){



for(let i=meteors.length-1;i>=0;i--){


let m=meteors[i];



m.y+=

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








function update(){


requestAnimationFrame(update);



if(gameState!=="playing"){

return;

}



ctx.clearRect(

0,

0,

500,

700

);



drawStars();




// 부드러운 이동

if(leftPressed){

player.x-=player.speed;

}


if(rightPressed){

player.x+=player.speed;

}



player.x=Math.max(

0,

Math.min(

440,

player.x

)

);



drawPlayer();



drawMeteors();




if(invincible>0){

invincible--;

}



}



update();