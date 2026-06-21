const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const overlay = document.getElementById("overlay");

const restartBtn =
document.getElementById("restartBtn");

const scoreEl =
document.getElementById("score");

const bestEl =
document.getElementById("best");

const livesEl =
document.getElementById("lives");

const finalScore =
document.getElementById("finalScore");

const finalBest =
document.getElementById("finalBest");



let player;

let meteors=[];

let stars=[];


let score=0;

let best=0;

let lives=3;

let gameStarted=false;

let gameOver=false;

let invincible=0;



let leftPressed=false;

let rightPressed=false;



function init(){


player={

x:225,

y:620,

width:50,

height:50,

speed:10

};


meteors=[];


stars=[];


for(let i=0;i<70;i++){

stars.push({

x:Math.random()*500,

y:Math.random()*700,

size:Math.random()*2+1

});

}


score=0;


lives=3;


invincible=0;


gameOver=false;


best=

localStorage.getItem("meteorBest") || 0;


overlay.classList.add("hidden");


updateUI();

}



function updateUI(){


livesEl.innerHTML=

"❤️".repeat(lives)

+

"🤍".repeat(3-lives);



scoreEl.innerText=score;


bestEl.innerText=best;


}



startBtn.addEventListener(

"click",

()=>{


gameStarted=true;


startScreen.style.display="none";


init();


}

);



restartBtn.addEventListener(

"click",

()=>{


init();


}

);




document.addEventListener(

"keydown",

(e)=>{


if(e.key==="ArrowLeft"){

leftPressed=true;

}


if(e.key==="ArrowRight"){

rightPressed=true;

}


}

);




document.addEventListener(

"keyup",

(e)=>{


if(e.key==="ArrowLeft"){

leftPressed=false;

}


if(e.key==="ArrowRight"){

rightPressed=false;

}


}

);




setInterval(()=>{


if(!gameStarted) return;


if(gameOver) return;



meteors.push({


x:Math.random()*450,


y:-50,


radius:20+Math.random()*20,


speed:3+Math.random()*3,


passed:false


});


},500);






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



m.y +=

m.speed +

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


gameOver=true;



overlay.classList.remove(

"hidden"

);



finalScore.innerText=score;


finalBest.innerText=best;



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

!gameStarted

||

gameOver

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

450,

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
