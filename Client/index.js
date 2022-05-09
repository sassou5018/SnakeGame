

const gameScreen= document.getElementById("gameScreen");
let canvas, c;
let playerNumber;
let gameActive = false;
const BG_COLOR= "#231f20";
const FOOD_COLOR= "#e66916";
const SNAKE_COLOR= "#c2c2c2";
const initScreen= document.getElementById("initialScreen");
const newGameBtn= document.getElementById("newGameButton");
const joinGameBtn= document.getElementById("joinGameButton");
const gameCodeInput= document.getElementById("gameCodeInput");
const gameCodeDisplay= document.getElementById("gameCodeDisplay");

newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", JoinGame);

function newGame(){
    socket.emit("newGame");
    init();
}
function JoinGame(){
    const code = gameCodeInput.value ;
    console.log(code);
    socket.emit("joinGame", code);
    init();
    //reset();
}

const socket = io();

socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownCode", handleUnknownGame);
socket.on("tooManyPlayers", handleTooManyPlayers);


const gameState = {
    player: {
        pos: {
            x:3,
            y:10
        },
        vel: {
            x:1,
            y:0
        },
        snake: [
            {x: 1, y: 10},
            {x: 2, y: 10},
            {x: 3, y: 10}
        ]
    },
    food: {
        x: 7,
        y: 7
    },
    gridSize: 20
}

function init(){
    initScreen.style.display= "none";
    gameScreen.style.display= "block";
    canvas=document.getElementById("canvas");
    c=canvas.getContext("2d");
    canvas.width = canvas.height = 600;
    c.fillStyle = BG_COLOR;
    c.fillRect (0, 0, canvas.width, canvas.height);

    document.addEventListener("keydown", keydown);
    gameActive= true;
}

function keydown(e) {
    socket.emit('keydown', e.key);
}




function paintGame(state) {
    c.fillStyle= BG_COLOR;
    c.fillRect(0, 0, canvas.width, canvas.height);
    const food = state.food;
    const size = canvas.width/ state.gridSize;

    //paint food
    c.fillStyle = FOOD_COLOR;
    c.fillRect(food.x*size, food.y*size, size, size);

    paintPlayer(state.players[0], size, SNAKE_COLOR);
    paintPlayer(state.players[1], size, "blue");
}

function paintPlayer(playerState, size, color) {
    const snake = playerState.snake;

    for (let cell of snake) {
        c.fillStyle= color;
        c.fillRect(cell.x*size, cell.y*size, size, size);
    }
}





function handleInit(number){
    playerNumber= number;
}

function handleGameState(gameState){
    if (!gameActive) return ;
    gameState= JSON.parse(gameState);
    requestAnimationFrame(()=>paintGame(gameState));
}

function handleGameOver(data){
    if (!gameActive) return;
    data= JSON.parse(data);
    if (data.winner === playerNumber) {
        alert("You Win !!!");
    } else alert("You Lose");
    gameActive= false;
}

function handleGameCode(gameCode){
    gameCodeDisplay.innerText= gameCode;
}

function handleUnknownGame(){
    reset();
    alert("Game Not Found!!! Verify Game Code!!!");
}

function handleTooManyPlayers(){
    reset();
    alert("Game is Full and In Progress!!!");
}

function reset(){
    playerNumber=null;
    gameCodeInput.value="";
    gameCodeDisplay.innerText="";
    initScreen.style.display="block";
    gameScreen.style.display="none";
}