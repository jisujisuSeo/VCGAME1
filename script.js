const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');

const timerText=document.getElementById('timer');
const gameOverScreen=document.getElementById('gameOverScreen');
const restartBtn=document.getElementById('restartBtn');
const resultText=document.getElementById('resultText');

let player, meteors;
let leftPressed=false, rightPressed=false;
let gameOver=false;
let startTime;

function init(){
  player={x:220,y:630,width:60,height:60,speed:7};
  meteors=[];
  gameOver=false;
  startTime=Date.now();
  gameOverScreen.classList.add('hidden');
}

document.addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft') leftPressed=true;
 if(e.key==='ArrowRight') rightPressed=true;
});

document.addEventListener('keyup',e=>{
 if(e.key==='ArrowLeft') leftPressed=false;
 if(e.key==='ArrowRight') rightPressed=false;
});

function createMeteor(){
 const size=Math.random()*40+30;
 meteors.push({
   x:Math.random()*(canvas.width-size),
   y:-size,
   width:size,
   height:size,
   speed:Math.random()*3+4
 });
}

setInterval(()=>{
 if(!gameOver) createMeteor();
},600);

function update(){
 if(gameOver) return;

 if(leftPressed) player.x-=player.speed;
 if(rightPressed) player.x+=player.speed;

 if(player.x<0) player.x=0;
 if(player.x+player.width>canvas.width)
    player.x=canvas.width-player.width;

 const surviveTime=Math.floor((Date.now()-startTime)/1000);
 timerText.innerText=`생존시간 : ${surviveTime}초`;

 const speedBonus=surviveTime*0.03;

 for(let i=meteors.length-1;i>=0;i--){
   const m=meteors[i];
   m.y+=m.speed+speedBonus;

   if(player.x < m.x+m.width &&
      player.x+player.width > m.x &&
      player.y < m.y+m.height &&
      player.y+player.height > m.y){
      endGame(false);
   }

   if(m.y>canvas.height) meteors.splice(i,1);
 }

 if(surviveTime>=60) endGame(true);
}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 ctx.fillStyle='#4FC3F7';
 ctx.fillRect(player.x,player.y,player.width,player.height);

 ctx.fillStyle='#ff5722';
 meteors.forEach(m=>{
   ctx.beginPath();
   ctx.arc(m.x+m.width/2,m.y+m.height/2,m.width/2,0,Math.PI*2);
   ctx.fill();
 });
}

function endGame(win){
 gameOver=true;
 gameOverScreen.classList.remove('hidden');
 resultText.innerText=win ? '🎉 YOU WIN' : '💀 GAME OVER';
}

function gameLoop(){
 update();
 draw();
 requestAnimationFrame(gameLoop);
}

restartBtn.addEventListener('click',()=>init());

init();
gameLoop();
