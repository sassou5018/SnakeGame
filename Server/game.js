const { GRID_SIZE } = require('./constans');

function initGame(){
    const state= createGameState();
    randomFood(state);
    return state;
}

function createGameState(){
    return gameState = {
        players: [{
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
        },{
            pos: {
                x:18,
                y:10
            },
            vel: {
                x:0,
                y:1
            },
            snake: [
                {x: 20, y: 10},
                {x: 19, y: 10},
                {x: 18, y: 10}
            ] 
        }],
        food: {},
        gridSize: GRID_SIZE
    }
    
}


function gameLoop(state){
    if (!state) return;
    const playerOne= state.players[0];
    const playerTwo= state.players[1];
    playerOne.pos.x+= playerOne.vel.x;
    playerOne.pos.y+= playerOne.vel.y;
    playerTwo.pos.x+= playerTwo.vel.x;
    playerTwo.pos.y+= playerTwo.vel.y;

    
    //edge colision detection for player 1
    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
        return 2;
    }
       //edge colision detection for player 2
       if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
        return 1;
    }

   
    //check food and add length for player 1
    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        playerOne.snake.push({...playerOne.pos});
        playerOne.pos.x+= playerOne.vel.x;
        playerOne.pos.y+= playerOne.vel.y;
        randomFood(state);
    }

        //check food and add length for player 2
        if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y){
            playerTwo.snake.push({...playerTwo.pos});
            playerTwo.pos.x+= playerTwo.vel.x;
            playerTwo.pos.y+= playerTwo.vel.y;
            randomFood(state);
        }

    if (playerOne.vel.x || playerOne.vel.y ) {
        for (let cell of playerOne.snake) {
            //check for snake colision on self p1
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) return 2;
        }

        playerOne.snake.push({...playerOne.pos});
        playerOne.snake.shift();
    }

    if (playerTwo.vel.x || playerTwo.vel.y ) {
        for (let cell of playerTwo.snake) {
            //check for snake colision on self p2
            if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) return 1;
        }

        playerTwo.snake.push({...playerTwo.pos});
        playerTwo.snake.shift();
    }

    return false;
}



function randomFood(state) {
    food= {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }

    for (let cell of state.players[0].snake) { //check if food is spawning on top of player 1
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }

    for (let cell of state.players[1].snake) { //check if food is spawning on top of player 2
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }
    }

    state.food = food;
}


function getUpdatedVel(key, state) {
    switch(key) {
        case 'ArrowLeft':{
            if (state.players[0].vel.x==1 || state.players[1].vel.x==1){
                return {x:1, y0};
            } else {return {x:-1, y:0};}}
        case 'ArrowUp':{
            if (state.players[0].vel.y==1 || state.players[1].vel.y==1){
                return {x:0, y:1};
            } else{return {x:0, y:-1}};}
        case 'ArrowRight':{
            if (state.players[0].vel.x==-1 || state.players[1].vel.x==-1){
            return {x:-1, y0};
        } else {return {x:1, y:0};}}
        case 'ArrowDown':{
            if (state.players[0].vel.y==-1 || state.players[1].vel.y==-1){
                return {x:0, y:-1};
            } else {return {x:0, y:1};}}
    }
}


module.exports= { initGame, gameLoop, getUpdatedVel }