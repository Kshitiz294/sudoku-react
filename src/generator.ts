let board: number[][] = [];
let filledPlaces = 0;

export function generateSudokuSolution(): number[][] {
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

function shuffleOptions(options: number[]): number[] {
    for (let i = 0; i < 10; i++) {
        let r1 = Math.floor(Math.random() * (options.length - 1));
        let r2 = Math.floor(Math.random() * (options.length - 1));

        [options[r1], options[r2]] = [options[r2], options[r1]];
    }

    return options;
}

function generateRandomNumberFromNumbersArray(numbers: number[]): number {
    let randomIndex = Math.floor(Math.random() * (numbers.length - 1));

    const randomNumber = numbers[randomIndex];

    return randomNumber;
}

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

// function getAvailableOptions(rowIndex: number, columnIndex: number, options: number[]): number[] {
//     const arr: number[] = [];
//     board.forEach((row: number[]) => arr.push(row[columnIndex]));
//     board[rowIndex].forEach((n: number) => arr.push(n));

//     return options.filter((o: number) => !arr.some((n: number) => o === n));
// }


function getTriplet(index: number): number[] {
    const quotient = Math.floor(index / 3);
    return [quotient * 3, quotient * 3 + 1, quotient * 3 + 2]
}

function canWeFillNumberHere(num: number, rowIndex: number, colIndex: number): boolean {
    if (board.find((row: number[]) => row[colIndex] === num)) {
        return false;
    }

    if ((board[rowIndex]).find((n: number) => n === num)) {
        return false;
    }

    return true;
}

export function initializeEmptyBoard(): number[][] {
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