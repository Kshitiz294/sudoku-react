import { Cube } from "./models/cube";

let board: number[][] = [];
let filledPlaces = 0;

// Function to get Sudoku board
export function createSudoku(): Cube[][] {
    let solution: number[][];
    // Iteratively generate a sudoku solution
    while (true) {
      try {
        solution = generateSudokuSolution();
        break;
  
      } catch (err: any) {
        // Nothing required
      }
    }

    // We have a solution, let's add it to the board
    let board: Cube[][] = solution.map((row: number[]) => {
      return row.map((n: number) => {
        return { reality: n, readonly: false };
      });
    });

    board = randomlyShowNumbersOnBoard(board);

    return board;
}

function randomlyShowNumbersOnBoard(board: Cube[][]): Cube[][] {
    let count = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const rand = Math.random();
            if (rand > 0.5) {
                board[i][j].readonly = true;
                board[i][j].value = board[i][j].reality;
                count += 1;
            }
        }
    }
    console.log(count);
    return board;
}

// Function to generate sudoku solution
function generateSudokuSolution(): number[][] {
    filledPlaces = 0;
    board = initializeEmptyBoard();
    for (let i = 0; i < 9; i += 3) {
        fillDiagonalSquare(i, i);
    }
    const squares: {rowIndex: number, columnIndex: number}[] = [];
    squares.push({rowIndex: 0, columnIndex: 3});
    squares.push({rowIndex: 0, columnIndex: 6});
    squares.push({rowIndex: 3, columnIndex: 0});
    squares.push({rowIndex: 3, columnIndex: 6});
    squares.push({rowIndex: 6, columnIndex: 0});
    squares.push({rowIndex: 6, columnIndex: 3});
    for (const square of squares) {
        let options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        options = shuffleOptions(options);
        canWeFillSquare(square.rowIndex, square.columnIndex, options);
    }

    if (filledPlaces === 81) {
        return board;
    } else {
        throw new Error('Not a valid solution');
    }
}

// Function to shuffle options array
function shuffleOptions(options: number[]): number[] {
    for (let i = 0; i < 10; i++) {
        let r1 = Math.floor(Math.random() * (options.length - 1));
        let r2 = Math.floor(Math.random() * (options.length - 1));

        [options[r1], options[r2]] = [options[r2], options[r1]];
    }

    return options;
}


// Funtion to get Random Nuber from Array
function generateRandomNumberFromNumbersArray(numbers: number[]): number {
    let randomIndex = Math.floor(Math.random() * (numbers.length - 1));

    const randomNumber = numbers[randomIndex];

    return randomNumber;
}

// Fill Diagonal(Independent) squares
function fillDiagonalSquare(rowIndex: number, columnIndex: number): void {
    const h = getTriplet(rowIndex);
    const v = getTriplet(columnIndex);

    let options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i of h) {
        for (let j of v) {
            const randomNumber = generateRandomNumberFromNumbersArray(options);

            board[i][j] = randomNumber;

            options = options.filter((o: number) => o !== randomNumber);
        }
    }

    filledPlaces += 9;
}

// Function to Fill Dependent Squares
function canWeFillSquare(rowIndex: number, columnIndex: number, options: number[]): boolean {
    for (const o of options) {
        if (canWeFillNumberHere(o, rowIndex, columnIndex)) {
            // We have reached end of square 
            if (rowIndex % 3 === 2 && columnIndex % 3 === 2) {
                // Everything seems fine, we should write number
                board[rowIndex][columnIndex] = o;
                return true;
            }

            // Fill next number in square
            let newri = 0;
            let newci = 0;
            if(columnIndex % 3 === 2) {
                newci = columnIndex - 2;
                newri = rowIndex + 1;
            } else {
                newci = columnIndex + 1;
                newri = rowIndex;
            }
            
            if (canWeFillSquare(newri, newci, options.filter((optn: number) => optn !== o))) {
                // Everything seems fine, we should write number
                board[rowIndex][columnIndex] = o;
                if (rowIndex % 3 === 0 && columnIndex % 3 === 0) {
                    filledPlaces += 9;
                }

                return true;
            }
        }
    }

    // We shall only reach here if no solution was possible
    return false;
}

// Get current square
function getTriplet(index: number): number[] {
    const quotient = Math.floor(index / 3);
    return [quotient * 3, quotient * 3 + 1, quotient * 3 + 2]
}

// Check if we can fill a number in this square
function canWeFillNumberHere(num: number, rowIndex: number, colIndex: number): boolean {
    if (board.find((row: number[]) => row[colIndex] === num)) {
        return false;
    }

    if ((board[rowIndex]).find((n: number) => n === num)) {
        return false;
    }

    return true;
}

// initialize empty number[][]
function initializeEmptyBoard(): number[][] {
    const board: Array<number[]> = [];
    for(let i = 0; i < 9; i++) {
      let row: number[] = [];
      for (let j = 0; j < 9; j++) {
        row.push(0);
      }
      board.push(row);
    }

    return board;
}