const main = () => {
    gameDisplay.render(gameBoard.getBoard());
}

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

    const setMarker = (symbol, row, column) => {
        if (getMarker(row, column) == " ") {
            board[row][column] = symbol;
            print();
            _checkWin(symbol);
            gameDisplay.render(getBoard());
        }
        else console.log("Square already filled");
    }

    const getMarker = (row, column) => { return board[row][column]; }

    const reset = () => {
        board = [[" ", " ", " "],
                 [" ", " ", " "],
                 [" ", " ", " "]];
    }

    const _checkWin = symbol => {
        let gameResult = _verifyWin(symbol);
        if (gameResult == "win") _win(symbol);
        else if (gameResult == "tie") _tie();
    }

    const _verifyWin = symbol => {
        let boardLength = board.length;
        let isBoardFull = true;
        let firstDiagonalSymbolCount = 0; // Top left to bottom right diagonal
        let secondDiagonalSymbolCount = 0; // Bottom left to top right diagonal
        for (let i = 0; i < boardLength; i++) {
            // Check if row is all symbol
            if (board[i].every((val, i, arr) => val === arr[0] && val == symbol)) return "win";

            // Check if column is all symbol
            let columnSymbolCount = 0;
            for (let j = 0; j < boardLength; j++) {
                if (board[j][i] == symbol) columnSymbolCount++;
                if (board[i][j] == " ") isBoardFull = false;
            }
            if (columnSymbolCount == boardLength) return "win";
            
            // Check if both diagonals is all symbol
            if (board[i][i] == symbol) firstDiagonalSymbolCount++;
            if (board[i][boardLength - 1 - i] == symbol) secondDiagonalSymbolCount++;
        }

        if (firstDiagonalSymbolCount == boardLength) return "win";
        else if (secondDiagonalSymbolCount == boardLength) return "win";
        else if (isBoardFull) return "tie";
    }

    const _win = symbol => {
        console.log(symbol + " WINS!");
    }

    const _tie = () => {
        console.log("TIE!");
    }

    return{ print, getBoard, setMarker, getMarker, reset };
})();

const gameDisplay = (function () {
    const squares = document.querySelectorAll(".square");

    const render = board => {
        for (let i = 0; i < board.length; i++) {
            console.log("test");
        }
    };

    return { render };
})();

main();





















// gameBoard.reset();
// gameBoard.setMarker("x", 0, 0);
// gameBoard.setMarker("x", 0, 1);
// gameBoard.setMarker("x", 0, 2);

// gameBoard.reset();
// gameBoard.setMarker("x", 1, 0);
// gameBoard.setMarker("x", 1, 1);
// gameBoard.setMarker("x", 1, 2);

// gameBoard.reset();
// gameBoard.setMarker("x", 2, 0);
// gameBoard.setMarker("x", 2, 1);
// gameBoard.setMarker("x", 2, 2);

// gameBoard.reset();
// gameBoard.setMarker("x", 0, 0);
// gameBoard.setMarker("x", 1, 0);
// gameBoard.setMarker("x", 2, 0);

// gameBoard.reset();
// gameBoard.setMarker("x", 0, 1);
// gameBoard.setMarker("x", 1, 1);
// gameBoard.setMarker("x", 2, 1);

// gameBoard.reset();
// gameBoard.setMarker("x", 0, 2);
// gameBoard.setMarker("x", 1, 2);
// gameBoard.setMarker("x", 2, 2);

// gameBoard.reset();
// gameBoard.setMarker("x", 0, 0);
// gameBoard.setMarker("x", 1, 1);
// gameBoard.setMarker("x", 2, 2);

// gameBoard.reset();
// gameBoard.setMarker("x", 0, 2);
// gameBoard.setMarker("x", 1, 1);
// gameBoard.setMarker("x", 2, 0);

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