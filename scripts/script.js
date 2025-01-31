const main = () => {
    gameManager.startGame();
}

const gameManager = (function() {
    let currentPlayer = "X";

    const startGame = () => {
        gameBoard.reset();
        gameDisplay.render(gameBoard.getBoard());
        gameDisplay.updatePlayer();
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const _restartGame = () => {
        currentPlayer = "X";
    }

    const _nextPlayer = () => {
        if (currentPlayer == "X") currentPlayer = "O";
        else if (currentPlayer == "O") currentPlayer = "X";
        events.trigger("playerChanged");
    }

    const _winGame = winner => {
        if (winner == "X") gameDisplay.changeMessage(gameDisplay.getPlayer1Name() + " WON!"); 
        else if (winner == "O") gameDisplay.changeMessage(gameDisplay.getPlayer2Name() + " WON!"); 
        
    }

    const _tieGame = () => {
        gameDisplay.changeMessage("TIE!"); 
    }

    events.subscribe("turnChanged", _nextPlayer);
    events.subscribe("restartGame", _restartGame);
    events.subscribe("gameWon", _winGame);
    events.subscribe("gameTie", _tieGame);
    return { startGame, getCurrentPlayer };
})();

const gameBoard = (function() {
    let board = [[" ", " ", " "],
                 [" ", " ", " "],
                 [" ", " ", " "]];

    const print = () => {
        let line = "";
        for(let i = 0; i < board.length; i++) {
            line += "|";
            for (let j = 0; j < board[i].length; j++) line += board[i][j] + "|";
            line += "\n";
        }
        console.log(line);
    } 
    
    const getBoard = () => { return board; }

    const getMarker = (coords) => { return board[coords[0]][coords[1]]; }

    const setMarker = (coords) => {
        if (getMarker(coords) == " ") {
            board[coords[0]][coords[1]] = gameManager.getCurrentPlayer();
            print();
            events.trigger("gameBoardChanged", getBoard());
        }
        else console.log("Square already filled");
    }

    const reset = () => {
        board = [[" ", " ", " "],
                 [" ", " ", " "],
                 [" ", " ", " "]];
    }

    const _verifyWin = () => {
        let currentPlayer = gameManager.getCurrentPlayer();
        let boardLength = board.length;
        let isBoardFull = true;
        let firstDiagonalSymbolCount = 0; // Top left to bottom right diagonal
        let secondDiagonalSymbolCount = 0; // Bottom left to top right diagonal
        for (let i = 0; i < boardLength; i++) {
            // Check if row is all symbol
            if (board[i].every((val, i, arr) => val === arr[0] && val == currentPlayer)) {
                events.trigger("gameWon", currentPlayer);
                return;
            }

            // Check if column is all symbol
            let columnSymbolCount = 0;
            for (let j = 0; j < boardLength; j++) {
                if (board[j][i] == currentPlayer) columnSymbolCount++;
                if (board[i][j] == " ") isBoardFull = false;
            }
            if (columnSymbolCount == boardLength) {
                events.trigger("gameWon", currentPlayer);
                return;
            }

            // Check if both diagonals is all symbol
            if (board[i][i] == currentPlayer) firstDiagonalSymbolCount++;
            if (board[i][boardLength - 1 - i] == currentPlayer) secondDiagonalSymbolCount++;
        }

        if (firstDiagonalSymbolCount == boardLength) {
            events.trigger("gameWon", currentPlayer);
            return;
        } else if (secondDiagonalSymbolCount == boardLength) {
            events.trigger("gameWon", currentPlayer);
            return;
        } else if (isBoardFull) {
            events.trigger("gameTie");
            return;
        }
        events.trigger("turnChanged");
    }

    events.subscribe("gameBoardChanged", _verifyWin);
    events.subscribe("squareClicked", setMarker);
    events.subscribe("restartGame", reset);
    return{ print, getBoard, setMarker, getMarker, reset };
})();

const gameDisplay = (function () {
    const squares = document.querySelectorAll(".square");
    const player1 = document.querySelector(".player1");
    const player1Name = document.querySelector(".player1 > .text");
    const player2 = document.querySelector(".player2");
    const player2Name = document.querySelector(".player2 > .text");
    const pointer = document.querySelector(".pointer > img");
    const menuMessage = document.querySelector(".menu-message");
    const restartButton = document.querySelector(".restart-button");
    
    restartButton.addEventListener("click", () => { _restartGame(); });
    player1.addEventListener("click", () => { _changePlayerName(player1); });
    player2.addEventListener("click", () => { _changePlayerName(player2); });
    squares.forEach(item => {
        item.addEventListener("click", () => {
            _squareClicked(item);
        });
    });

    const render = board => {
        let boardSymbols = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                boardSymbols.push(board[i][j]);
            }
        }

        let count = 0;
        squares.forEach(item => {
            item.textContent = boardSymbols[count];
            count++;
        });
    };

    const changeMessage = text => {
        menuMessage.textContent = text;
    };

    const updatePlayer = () => {
        let currentPlayer = gameManager.getCurrentPlayer();
        if (currentPlayer == "X") {
            player1Name.style.filter = "drop-shadow(0px 0px 30px white)";
            player2Name.style.filter = "revert";
            pointer.style.transform = "translate(-150%, 0) rotate(0deg)";
            changeMessage(player1Name.querySelector(".name").textContent + "'s Turn");
        } else if (currentPlayer == "O") {
            player2Name.style.filter = "drop-shadow(0px 0px 30px white)";
            player1Name.style.filter = "revert";
            pointer.style.transform = "translate(150%, 0) rotate(-540deg)";
            changeMessage(player2Name.querySelector(".name").textContent + "'s Turn");
        }
    }

    const getPlayer1Name = () => {
        return player1Name.querySelector(".name").textContent;
    }

    const getPlayer2Name = () => {
        return player2Name.querySelector(".name").textContent;
    }

    const _restartGame = () => {
        squares.forEach(item => { item.style.color = "black"; });
        events.trigger("restartGame");
        render(gameBoard.getBoard());
        updatePlayer();
    }

    const _squareClicked = item => {
        if (gameManager.getCurrentPlayer() == "O" && item.textContent != "X") {
            item.style.color = "white";
        }
        item.style.fontSize = "4em";
        events.trigger("squareClicked", [item.id[0], item.id[1]]);
    }

    const _changePlayerName = player => {
        let newName = prompt("Type your name: ");
        player.querySelector(".name").textContent = newName;
    }

    events.subscribe("gameBoardChanged", render);
    events.subscribe("playerChanged", updatePlayer);
    return { render, changeMessage, updatePlayer, getPlayer1Name, getPlayer2Name };
})();

main();























/*
WIN CONDITIONS INCLUDE
a[0], a[1], a[2] == "X" [YES]
b[0], b[1], b[2] == "X" [YES]
c[0], c[1], c[2] == "X" [YES]
a[0], b[0], c[0] == "X" [YES]
a[1], b[1], c[1] == "X" [YES]
a[2], b[2], c[2] == "X" [YES]
a[0], b[1], c[2] == "X"
a[2], b[1], c[0] == "X"

board[0][0]
board[1][1]
board[2][2]

board[0][2]
board[1][1]
board[2][0]
*/

/*
3x3 tic tac toe board
store gameboard as array inside gameboard object
little global code as possible using factories, etc.
think about 3 in a rows and ties
start with console, then display

2 PLAYER TIC TAC TOE GAME WITH 3x3 GAME BOARD

- GAME BOARD OBJECT
    - GAMEBOARD ARRAY
    - PLACE MARKER
    - CHECK FOR WIN

- PLAYER OBJECT
    - NAME
    - SYMBOL "X" OR "O"

- DISPLAY OBJECT
    - RENDER (TO MATCH GAMEBOARD)
    - CLICK SQUARE (CHECK IF VALID OR NOT)

GAME FLOW
    - START GAME WINDOW
        - Player 1 name -> X
        - Player 2 name -> O
        - Start Game Button
    - PLAYER 1 TURN START
    - PLAYER 1 CHOOSES SQUARE
        - CHECK IF VALID
            - IF VALID, RENDER SQUARE
            - IF INVALID, ALERT PLAYER AND TRY AGAIN
    - CHECK WIN CONDITION
        - IF YES, ANNOUNCE WINNER AND REPLAY GAME BUTTON
        - IF TIE, ANNOUNCE TIE AND REPLAY GAME BUTTON
        - IF NO, CONTINUE
    - REPEAT WITH PLAYER 2 UNTIL WIN

LETS START WITH THE GAME BOARD ARRAY
a [0, 0, 0]
b [0, 0, 0]
c [0, 0, 0]

// const gameBoard = (function() {
//     let name = "board";

//     const sayName = () => console.log(name);

//     const setName = newName => name = newName;

//     return { sayName, setName };
// })();

/*
|x|x|x|
|x|x|x|
|x|x|x|
*/