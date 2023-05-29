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
let numberOfMines = 5;
let board = [];
let cleanArray = [];
let cleanMatrix = [];
let firstClickMode = "standard"; // "unlucky" = can hit bomb on first cell | "standard" = can't hit bomb | "noguess" = will always first click cell with no adjacent bombs

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
        let isFirstClick = true;
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
                    revealed: false,
                    flagged: false,
                    count: 0,
                    id: theID,
                    coord: `${i}, ${j}`,
                };
            }
        }

        const boardContainer = document.querySelector(".board");
        boardContainer.innerHTML = "";

        for (let x = 0; x < boardHeight; x++) {
            for (let y = 0; y < boardWidth; y++) {
                const cell = document.createElement("div");
                cell.id = `${x}_${y}`;
                cell.classList.add("cell", "hidden");

                cell.addEventListener("click", () => {
                    if (isFirstClick) {
                        placeMines([x, y]);
                        countAdjacentMinesForAllCells();
                        isFirstClick = false;
                        revealCell(x, y);
                    } else if (!board[x][y].revealed) {
                        revealCell(x, y);
                    }
                });

                cell.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (!isFirstClick && !board[x][y].revealed) {
                        flagCell(x, y);
                    }
                });

                boardContainer.appendChild(cell);
            }
        }
    } else {
        console.error("Conditions are wrong");
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
    const cellElement = document.getElementById(`${row}_${col}`);
    cellElement.classList.remove("hidden");
    cellElement.innerText = board[row][col].count === 0 ? " " : board[row][col].count;
    //cellElement.classList.add(revealed);

    if (board[row][col].count === 0) {
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

function flagCell(row, col) {
    const cellElement = document.getElementById(`${row}_${col}`);
    if (board[row][col].flagged == false) {
        board[row][col].flagged = true;
        cellElement.classList.add("flagged");
    } else {
        cellElement.classList.remove("flagged");
        board[row][col].flagged = false;
    }
}

function gameOver() {
    alert("Game Over!");
    initializeBoard();
}

function startGame(firstClick) {
    initializeBoard();
}

initializeBoard();

document.getElementById("startGame").addEventListener("click", function () {
    initializeBoard();
    console.log("Started Game");
});
