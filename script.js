
const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");

const bestEl = document.getElementById("best");

const livesEl = document.getElementById("lives");

const overlay = document.getElementById("overlay");

const finalScore = document.getElementById("finalScore");

const finalBest = document.getElementById("finalBest");

const restartBtn = document.getElementById("restartBtn");



let player;

let meteors=[];

let stars=[];

let lives;

let score;

let best;

let invincible=0;

let gameOver=false;



function init(){


player={

x:225,

y:620,

width:50,

height:50,

speed:8

};


meteors=[];


stars=[];


for(let i=0;i<50;i++){

stars.push({

x:Math.random()*500,

y:Math.random()*700,

size:Math.random()*2+1

});

}



lives=3;


score=0;


best=localStorage.getItem("meteorBest") || 0;


invincible=0;


gameOver=false;


overlay.classList.add("hidden");


updateHud();

}



function updateHud(){


livesEl.innerHTML=

"❤️".repeat(lives)+

"🤍".repeat(3-lives);


scoreEl.innerText=score;


bestEl.innerText=best;

}



document.addEventListener("keydown",(e)=>{


if(e.key==="ArrowLeft"){

player.x-=player.speed;

}


if(e.key==="ArrowRight"){

player.x+=player.speed;

}


});



setInterval(()=>{


if(gameOver) return;


meteors.push({

x:Math.random()*450,

y:-50,

radius:20+Math.random()*20,

speed:3+Math.random()*3,

passed:false

});


},550);




function collision(a,b){


return (

a.x < b.x+b.radius*2 &&

a.x+a.width > b.x &&

a.y < b.y+b.radius*2 &&

a.y+a.height > b.y

);

}



function drawStars(){


ctx.fillStyle="white";


stars.forEach(star=>{

star.y+=1;


if(star.y>700){

star.y=0;

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

invincible>0 &&

Math.floor(invincible/5)%2

){

ctx.fillStyle="white";

}

else{

ctx.fillStyle="#22d3ee";

}



ctx.beginPath();


ctx.moveTo(player.x+25,player.y);

ctx.lineTo(player.x,player.y+50);

ctx.lineTo(player.x+50,player.y+50);

ctx.closePath();

ctx.fill();

}



function drawMeteors(){


for(let i=meteors.length-1;i>=0;i--){

let m=meteors[i];


m.y+=m.speed+(score*0.01);


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



if(m.y>700 && !m.passed){

m.passed=true;

score++;


if(score>best){

best=score;

localStorage.setItem(

"meteorBest",

best

);

}


updateHud();

}



if(collision(player,m) && invincible<=0){


lives--;


invincible=60;


updateHud();



if(lives<=0){

gameOver=true;


overlay.classList.remove("hidden");


finalScore.innerText=score;


finalBest.innerText=best;

}

}



if(m.y>760){

meteors.splice(i,1);

}


}

}



function update(){


ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);



drawStars();



player.x=Math.max(

0,

Math.min(

450,

player.x

)

);



drawPlayer();



drawMeteors();



if(invincible>0){

invincible--;

}



requestAnimationFrame(update);

}



restartBtn.addEventListener(

"click",

()=>{

init();

}

);



init();

update();
