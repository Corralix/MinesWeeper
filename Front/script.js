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
let boardHeight = 9;
let boardWidth = 9;
let numberOfMines = 78;
let board = [];
let cleanArray = [];
let cleanMatrix = [];
let firstClickMode = "standard"; // "unlucky" = can hit bomb on first cell | "standard" = can't hit bomb | "noguess" = will always first click cell with no adjacent bombs
//let rabCount = 0;

function coordToID(coord) {
    return coord[0] * boardWidth + coord[1];
}

function IDToCoord(ID) {
    // only useful if cleanArray is used instead of cleanMatrix
    const x = Math.floor(ID / boardWidth);
    const y = theID - x * boardWidth;
    return [x, y];
}

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
    let mines = [];
    if (firstClickMode === "standard") {
        cleanMatrix.splice(coordToID(firstClick), 1);
    }
    /*
    console.log(
        cleanMatrix.findIndex((pair) => {
            return pair[0] === pairToRemove[0] && pair[1] === pairToRemove[1];
        })
    );
    */
    for (let minesPlaced = 0; minesPlaced < numberOfMines; minesPlaced++) {
        const randIndex = Math.floor(Math.random() * cleanMatrix.length);
        mines = mines.concat(cleanMatrix.splice(randIndex, 1));
    }

    for (let mineCoord of mines) {
        board[mineCoord[0]][mineCoord[1]].mine = true;
    }
}

function countAdjacentMines(row, col) {
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
                /*cell.innerText = `${board[i][j].show}`;*/

                //console.log("revealed", i, j, board[i][j].count);
                //cell.classList.remove("hidden");
                if (board[i][j].mine) {
                    cell.innerText = "_";
                } else {
                    cell.innerText = board[i][j].count === 0 ? " " : board[i][j].count;
                }
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

let firstClick = [4, 4];

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

document.getElementById("startGame").addEventListener("mouseup", function () {
    initializeBoard();
    //console.log("clicked");
});
