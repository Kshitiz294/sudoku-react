export function generateSudokuSolution(): number[][] {
    try {
        let board = initializeEmptyBoard();

        for (let i = 1; i < 10; i++) {

            board = fillNumberInBoard(board, i);
        }

        return board;
    } catch (err) {
        throw err;
    }
}

export function generateRandomNumberFromNumbersArray(numbers: number[]): number {
    let randomIndex = Math.floor(Math.random() * numbers.length);

    // handling the case if randomIndex === numbers.length

    if (randomIndex === numbers.length) {
        randomIndex = numbers.length - 1;
    }

    const randomNumber = numbers[randomIndex];

    return randomNumber;
}

export function fillNumberInBoard(board: number[][], randomNumber: number): number[][] {
    try {
        // Loop for triplets (3 vertical squares)
        for (let tIndex = 0; tIndex < 3; tIndex++) {
            board = fillTriplets(board, randomNumber, tIndex);
        }

        return board;
    } catch (err) {
        throw err;
    }
}

export function fillTriplets(board: number[][], randomNumber: number, tripletIndex: number): number[][] {

    for (let index = 0; index < 3; index++) {
        let colIndex = tripletIndex * 3 + index;

        const colOptions = getEmptyCells(board, colIndex);

        if (colOptions.length === 0) {
            console.log(`Cannot add ${randomNumber} in column ${colIndex}`);
            throw new Error(`Cannot add ${randomNumber} in column ${colIndex}`);
        }

        let rowIndex = generateRandomNumberFromNumbersArray(colOptions);

        // We have our number, let's put it
        board[rowIndex][colIndex] = randomNumber;

        // Also, let's refine our options
        // const tripletToEliminate = getTriplet(rowIndex);

        // options = options.filter((o: number) => !tripletToEliminate.some((t: number) => t === o));
    }

    return board;
}

export function getEmptyCells(board: number[][], colIndex: number): number[] {
    const emptyCells: number[] = [];

    for (let i = 0; i < 9; i++) {
        if (board[i][colIndex] === 0) {
            emptyCells.push(i);
        }
    }

    return emptyCells;
}

export function getTriplet(index: number): number[] {
    const quotient = Math.floor(index / 3);
    return [quotient * 3, quotient * 3 + 1, quotient * 3 + 2]
}

export function canWeFillNumberHere(board: number[][], randomNumber: number, rowIndex: number, colIndex: number): boolean {
    if (board[rowIndex][colIndex] !== 0) {
        return false;
    }

    if ((board[rowIndex]).find((n: number) => n === randomNumber)) {
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