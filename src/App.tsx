import React, { useEffect, useState } from 'react';
import './App.scss';
import * as sudoku from './generator';
import { Cube } from './models/cube';

function App() {
  const [gameBoard, setGameBoard] = useState<Array<Cube[]>>([]);
  const [selectedrowIndex, setSelectedRowIndex] = useState<number | undefined>(undefined);
  const [selectedcolumnIndex, setSelectedColumnIndex] = useState<number | undefined>(undefined);
  const [disableButtons, setDisableButtons] = useState<boolean>(true);
  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    if (selectedrowIndex === undefined || selectedcolumnIndex === undefined) {
      setDisableButtons(true);
    } else if (gameBoard[selectedrowIndex][selectedcolumnIndex].readonly) {
      setDisableButtons(true);
    } else {
      setDisableButtons(false);
    }
  }, [selectedrowIndex, selectedcolumnIndex, gameBoard])

  useEffect(() => {
    let solution: number[][];
    // Iteratively generate a sudoku solution
    while (true) {
      try {
        solution = sudoku.generateSudokuSolution();
        break;
  
      } catch (err: any) {
        // Nothing required
      }
    }

    // We have a solution, let's add it to the board
    const board: Cube[][] = solution.map((row: number[]) => {
      return row.map((n: number) => {
        return { reality: n, readonly: false };
      });
    });

    // let's show a few numbers (30 to be precise)
    let count = 0;
    while (count <= 30) {
      const rowIndex = Math.floor(Math.random() * 8);
      const columnIndex = Math.floor(Math.random() * 8);

      if(!board[rowIndex][columnIndex].readonly) {
        board[rowIndex][columnIndex].readonly = true;
        board[rowIndex][columnIndex].value = board[rowIndex][columnIndex].reality;
        count += 1;
      }
    }

    setGameBoard(board);
    
  }, []);

  const selectCube = (rowIndex: number, columnIndex: number): void => {
    setSelectedRowIndex(rowIndex);
    setSelectedColumnIndex(columnIndex);
  }

  const setNumberInCube = (n: number): void => {
    if (selectedrowIndex !== undefined && selectedcolumnIndex !== undefined) {
      if (!gameBoard[selectedrowIndex][selectedcolumnIndex].readonly) {
        gameBoard[selectedrowIndex][selectedcolumnIndex].value = n;
        const board = [...gameBoard];
        setGameBoard(board);
      }
    }
  }

  const isAffectedCube = (rowIndex: number, columnIndex: number): boolean => {
    if (selectedrowIndex === undefined || selectedcolumnIndex === undefined) {
      return false;
    }

    if (rowIndex === selectedrowIndex || columnIndex === selectedcolumnIndex) {
      return true;
    }

    if (Math.floor(rowIndex / 3) === Math.floor(selectedrowIndex / 3) && Math.floor(columnIndex / 3) === Math.floor(selectedcolumnIndex / 3)) {
      return true;
    }

    return false;
  }

  const getClasses = (rowIndex: number, columnIndex: number): string => {
    const classes = ['cube', 'flex-container-column'];

    if (rowIndex === selectedrowIndex && columnIndex === selectedcolumnIndex) {
      classes.push('selected-cube');
    } else if (isAffectedCube(rowIndex, columnIndex)) {
      classes.push('affected-cube');
    } else {
      if (selectedrowIndex !== undefined && selectedcolumnIndex !== undefined && gameBoard[selectedrowIndex][selectedcolumnIndex].value !== undefined) {
        if (gameBoard[rowIndex][columnIndex].value === gameBoard[selectedrowIndex][selectedcolumnIndex].value) {
          classes.push('same-cube');
        }
      }
    }


    if (!gameBoard[rowIndex][columnIndex].readonly && gameBoard[rowIndex][columnIndex].value) {
      if (gameBoard[rowIndex][columnIndex].value === gameBoard[rowIndex][columnIndex].reality) {
        classes.push('correct-answer');
      } else {
        classes.push('wrong-answer');
      }
    }

    return classes.join(' ');
  }

  return (
    <div className="App flex-container-column">

      {/* Game Board */}
      {
        gameBoard.map((row: Cube[], i: number) => {
          return (
            <div key={i} className="flex-container-row horizontal-row">
              {
                row.map((cube: Cube, j: number) => {
                  const classes = getClasses(i, j);
                  return (
                    <div key={j} className={classes} onClick={() => selectCube(i, j)}>{cube.readonly ? cube.reality : cube.value}</div>
                  );
                })
              }
            </div>
          );
        })
      }

      {/* Buttons */} 
      <div className="flex-container-row" style={{marginTop: '20px', width: '288px', justifyContent: 'space-between'}}>
        {
          numberButtons.map((num: number, index: number) => {
            return <button key={index} disabled={disableButtons} onClick={() => setNumberInCube(num)}>{num}</button>
          })
        }
      </div>
    </div>
  );
}

export default App;
