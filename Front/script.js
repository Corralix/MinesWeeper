let boardHeight = 4;
let boardWidth = 5;
let numberOfMines = 4;
let board = [];
let cleanArray = [];
let cleanMatrix = [];
let mines = [];
let minesPlaced = 0;
//let rabCount = 0;

function initializeBoard() {
    if (boardHeight > 1 && boardWidth > 1 && numberOfMines <= boardHeight * boardWidth - 2 && numberOfMines > 1) {
        cleanArray = Array.from({ length: boardHeight * boardWidth }, (x, i) => i);
        cleanMatrix = Array.from({ length: boardHeight * boardWidth }, (x, i) => [
            Math.floor(i / boardWidth),
            i - Math.floor(i / boardWidth) * boardWidth,
        ]);

        document.getElementById("board").style.gridTemplateColumns = `repeat(${boardWidth}, 0fr)`;
        for (let i = 0; i < boardHeight; i++) {
            board[i] = [];
            console.log(i);
            for (let j = 0; j < boardWidth; j++) {
                let theID = i * boardWidth + j; // i = Math.floor(theID / boardWidth)    ,  j = theID - Math.floor(theID / boardWidth) * boardWidth
                board[i][j] = {
                    mine: false,
                    revealed: true,
                    count: 0,
                    id: theID,
                    coord: `${i}, ${j}`,
                    show: theID,
                };
                //rabCount += 1;
            }
        }
    } else {
        console.log("ERROR: Conditions are wrong");
    }
}

function placeMines(firstClick) {
    for (let id = 0; id < numberOfMines; id++) {
        const randID = Math.floor(Math.random() * cleanMatrix.length);
        mines = mines.concat(cleanMatrix.splice(randID, 1));
    }

    for (let mineCoord of mines) {
        let x = mineCoord;
        console.log(x, x[0], x[1]);
    }
    //console.log("Leftover", cleanArray);
    //console.log("MINES", mines);

    /*
    while (minesPlaced < numberOfMines) {
        const row = Math.floor(Math.random() * boardWidth);
        const col = Math.floor(Math.random() * boardHeight);

        console.log(`Trying to place at ${row} , ${col}`);

        if (!board[row][col].mine) {
            if (Math.abs(row - firstClick.x) <= 1 && Math.abs(col - firstClick.y) <= 1) {
            } else {
                board[row][col].mine = true;
                console.log("Placed");
                minesPlaced++;
            }
        }
    }
    */
}

function countAdjacentMines(row, col) {
    const neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    for (let i = 0; i < neighbors.length; i++) {
        const [dx, dy] = neighbors[i];
        const newRow = row + dx;
        const newCol = col + dy;

        if (newRow >= 0 && newRow < boardHeight && newCol >= 0 && newCol < boardWidth && board[newRow][newCol].mine) {
            board[row][col].count++;
        }
    }
}

function countAdjacentMinesForAllCells() {
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            if (!board[i][j].mine) {
                countAdjacentMines(i, j);
            }
        }
    }
}

function revealCell(row, col) {
    if (board[row][col].mine) {
        gameOver();
        return;
    }

    board[row][col].revealed = true;

    if (board[row][col].count === 0) {
        const neighbors = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        for (let i = 0; i < neighbors.length; i++) {
            const [dx, dy] = neighbors[i];
            const newRow = row + dx;
            const newCol = col + dy;

            if (
                newRow >= 0 &&
                newRow < boardHeight &&
                newCol >= 0 &&
                newCol < boardWidth &&
                !board[newRow][newCol].revealed
            ) {
                revealCell(newRow, newCol);
            }
        }
    }
}

function renderBoard() {
    const boardContainer = document.querySelector(".board");
    boardContainer.innerHTML = "";

    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            const cell = document.createElement("div");
            cell.id = `${i}_${j}`;
            cell.classList.add("cell"); //, "hidden");

            if (board[i][j].revealed) {
                cell.innerText = `${board[i][j].show}`;
                /*
                console.log("revealed", i, j, board[i][j].count);
                //cell.classList.remove("hidden");
                if (board[i][j].mine) {
                    cell.innerText = "X";
                } else {
                    cell.innerText = board[i][j].count === 0 ? " " : board[i][j].count;
                }
                */
            }

            cell.addEventListener("click", () => {
                if (!board[i][j].revealed) {
                    revealCell(i, j);
                    renderBoard();
                }
            });

            boardContainer.appendChild(cell);
        }
    }
}

function gameOver() {
    alert("Game Over!");
    initializeBoard();
    placeMines();
    countAdjacentMinesForAllCells();
    renderBoard();
}

let firstClick = { x: 5, y: 5 };

function startGame(firstClick) {
    initializeBoard();
    placeMines(firstClick);
    countAdjacentMinesForAllCells();
    renderBoard();
}

initializeBoard();
placeMines(firstClick);
countAdjacentMinesForAllCells();
renderBoard();
