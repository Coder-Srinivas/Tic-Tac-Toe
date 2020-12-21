document.addEventListener("DOMContentLoaded",()=>{
    var originalBoard;
    const human = 'O';
    const ai = "X";
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    const cells = document.querySelectorAll('.cell');
    const startButton = document.querySelector('.startBtn');
    startButton.addEventListener('click',()=>{
        startGame();
    })
    startGame();

    function startGame () {
        document.querySelector(".endGame").style.display = 'none';
        originalBoard = Array.from(Array(9).keys());
        for(var i = 0; i < cells.length; i++){
            cells[i].innerText = '';
            cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click', turnClick);
        }
    }

    function turnClick (event) {
        if(typeof originalBoard[event.target.id] == 'number'){
            turn(event.target.id, human);
            if(!checkTie()) turn(bestSpot(),ai)
        }
        
    }

    function turn (squareId , player){
        originalBoard[squareId] = player;
        document.getElementById(squareId).innerText = player;
        let gameWon = checkWin(originalBoard, player)
        if(gameWon) gameOver(gameWon)
    }

    function checkWin(board, player){
        let plays = board.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for(let [index, win] of winCombos.entries()){
            if(win.every(elem => plays.indexOf(elem) > -1)){
                gameWon = {index: index, player: player};
                break;
            }
        }
        return gameWon;
    }

    function gameOver(gameWon) {
        for(let index of winCombos[gameWon.index]){
            document.getElementById(index).style.backgroundColor = 
            gameWon.player == human ? "green" : "red";
        }
        for(var i=0;i < cells.length; i++){
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(gameWon.player == human ? "You Win!!":"You Lose!!")
    }

    function emptySquares() {
        return originalBoard.filter(s => typeof s == 'number');
    }

    function bestSpot() {
        return minimax(originalBoard, ai).index;
    }

    function checkTie() {
        if (emptySquares().length == 0){
            for(var i = 0;i < cells.length; i++){
                cells[i].removeEventListener('click',turnClick, false);
                cells[i].style.backgroundColor = 'orange';
            }
            declareWinner("Tie Game!");
            return true
        }
        return false;
    }

    function declareWinner(player) {
        document.querySelector(".endGame").style.display='block';
        document.querySelector(".endGame .text").innerText=player;
    }

    function minimax(newBoard, player){
        var availSpots = emptySquares();

        if (checkWin(newBoard, human)){
            return {score:-10};
        } else if (checkWin(newBoard, ai)) {
            return {score: 10};
        } else if (availSpots.length === 0){
            return {score: 0};
        }
        
        var moves = [];
        for(var i =0; i < availSpots.length; i++){
            var move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if(player == ai){
                var result = minimax(newBoard, human);
                move.score = result.score;
            }else{
                var result = minimax(newBoard, ai);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        var bestMove;

        if(player == ai){
            var bestScore = -10000;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    
})