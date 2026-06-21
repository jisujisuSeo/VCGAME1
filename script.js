const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;


// --------------------
// 게임 상태
// --------------------

let gameStarted = false;
let gameOver = false;

let score = 0;

let bestScore =
Number(localStorage.getItem("meteorBest")) || 0;

let lives = 3;


// --------------------
// 우주선
// --------------------

const ship = {

    x: WIDTH/2 -16,

    y: HEIGHT -90,

    width:32,

    height:32,

    speed:0,

    maxSpeed:7,

    accel:0.6,

    friction:0.88,

    invincible:0

};


// --------------------
// 키 입력
// --------------------

const keys = {};

document.addEventListener("keydown",e=>{

    keys[e.key]=true;

});

document.addEventListener("keyup",e=>{

    keys[e.key]=false;

});




// --------------------
// 별
// --------------------

const stars=[];

for(let i=0;i<100;i++){

    stars.push({

        x:Math.random()*WIDTH,

        y:Math.random()*HEIGHT,

        size:Math.random()*2+1,

        speed:Math.random()*2+0.5

    });

}


function drawStars(){

    ctx.fillStyle="white";


    stars.forEach(st=>{

        st.y+=st.speed;

        if(st.y>HEIGHT){

            st.y=0;

            st.x=Math.random()*WIDTH;

        }

        ctx.fillRect(

            st.x,

            st.y,

            st.size,

            st.size

        );

    });

}



// --------------------
// 운석
// --------------------


const meteors=[];


function spawnMeteor(){

    const type=Math.floor(Math.random()*3);



    let size=20;

    let speed=4;


    if(type===1){

        size=30;

        speed=5;

    }


    if(type===2){

        size=45;

        speed=3;

    }


    meteors.push({

        x:Math.random()*(WIDTH-size),

        y:-size,

        size:size,

        speed:speed,

        rot:0,

        rotSpeed:

        (Math.random()-0.5)*0.1

    });

}




function updateMeteors(){


    meteors.forEach(m=>{

        m.y+=m.speed;

        m.rot+=m.rotSpeed;

    });

}



function drawMeteors(){


    meteors.forEach(m=>{

        ctx.save();


        ctx.translate(

            m.x+m.size/2,

            m.y+m.size/2

        );

        ctx.rotate(m.rot);


        ctx.fillStyle="#777";


        ctx.beginPath();


        ctx.arc(

        0,

        0,

        m.size/2,

        0,

        Math.PI*2

        );


        ctx.fill();


        ctx.restore();

    });

}



// --------------------
// 우주선 이동
// --------------------



function moveShip(){


    if(keys["ArrowLeft"] ||

       keys["a"] ||

       keys["A"]){


        ship.speed-=ship.accel;

    }


    if(keys["ArrowRight"] ||

       keys["d"] ||

       keys["D"]){


        ship.speed+=ship.accel;

    }



    ship.speed*=ship.friction;



    if(ship.speed>ship.maxSpeed)

    ship.speed=ship.maxSpeed;



    if(ship.speed<-ship.maxSpeed)

    ship.speed=-ship.maxSpeed;



    ship.x+=ship.speed;



    if(ship.x<0)

    ship.x=0;



    if(ship.x>

        WIDTH-ship.width)

    ship.x=

        WIDTH-ship.width;

}




function drawShip(){


    if(

    ship.invincible>0 &&

    Math.floor(ship.invincible/5)%2===0

    ){

        return;

    }


    ctx.fillStyle="#69b7ff";



    ctx.beginPath();


    ctx.moveTo(

        ship.x+16,

        ship.y

    );


    ctx.lineTo(

        ship.x,

        ship.y+32

    );


    ctx.lineTo(

        ship.x+32,

        ship.y+32

    );


    ctx.closePath();


    ctx.fill();


}
// --------------------
// 충돌 판정
// --------------------

function checkCollision(){

    meteors.forEach((m,index)=>{

        const dx =
        (m.x+m.size/2)
        -
        (ship.x+ship.width/2);

        const dy =
        (m.y+m.size/2)
        -
        (ship.y+ship.height/2);

        const distance =
        Math.sqrt(dx*dx+dy*dy);


        if(

        distance

        <

        m.size/2 + 12

        &&

        ship.invincible<=0

        ){

            lives--;

            ship.invincible=120;

            meteors.splice(index,1);


            if(lives<=0){

                endGame();

            }

        }

    });

}



// --------------------
// HUD
// --------------------

function drawHUD(){


document.getElementById("score").innerText=

" SCORE : "+score;


document.getElementById("best").innerText=

" BEST : "+bestScore;



let hearts="";

for(let i=0;i<lives;i++){

hearts+="❤️ ";

}


document.getElementById("lives")

.innerHTML=hearts;


}



// --------------------
// 점수
// --------------------


function updateScore(){


meteors.forEach((m,index)=>{


if(m.y>HEIGHT+100){

score++;

meteors.splice(index,1);

}

});

}



// --------------------
// 게임 종료
// --------------------


function endGame(){


gameOver=true;


if(score>bestScore){

bestScore=score;


localStorage.setItem(

"meteorBest",

bestScore

);

}



document

.getElementById("finalScore")

.innerHTML=

"최종 점수 : "

+

score;



document

.getElementById("gameOver")

.classList

.remove("hidden");


}




// --------------------
// 게임 루프
// --------------------


let spawnTimer=0;



function animate(){


if(!gameStarted)return;



ctx.clearRect(

0,

0,

WIDTH,

HEIGHT

);



drawStars();



moveShip();



drawShip();



spawnTimer++;



if(spawnTimer>35){


spawnMeteor();


spawnTimer=0;


}



updateMeteors();



drawMeteors();



checkCollision();



updateScore();



drawHUD();



if(ship.invincible>0){

ship.invincible--;

}



if(!gameOver){

requestAnimationFrame(

animate

);

}


}





// --------------------
// 시작 버튼
// --------------------



document

.getElementById("startBtn")

.addEventListener(

"click",

()=>{


document

.getElementById(

"startScreen"

)

.classList

.add("hidden");



gameStarted=true;

gameOver=false;

score=0;

lives=3;



animate();


}

);




// --------------------
// 재시작
// --------------------



document

.getElementById(

"restartBtn"

)

.addEventListener(

"click",

()=>{


meteors.length=0;



score=0;

lives=3;


ship.x=

WIDTH/2-16;


ship.invincible=0;


gameOver=false;



document

.getElementById(

"gameOver"

)

.classList

.add("hidden");



animate();


}

);




// 최고점수 표시


document

.getElementById("best")

.innerHTML=

"BEST : "

+

bestScore;