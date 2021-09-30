import React, { useEffect, useState } from 'react';
import './App.scss';
import * as sudoku from './generator';
import { Cube } from './models/cube';

function App() {
  const [gameBoard, setGameBoard] = useState<Array<Cube[]>>([]);
  const [selectedCube, setSelectedCube] = useState<Cube | undefined>(undefined);
  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

  const selectCube = (rowIndex: number, columnIndex: number) => {
    setSelectedCube(gameBoard[rowIndex][columnIndex].readonly ? undefined : gameBoard[rowIndex][columnIndex]);
  }

  const setNumberInCube = (n: number) => {
    if (selectedCube) {
      selectedCube.value = n;
      const board = [...gameBoard];
      setGameBoard(board);
    }
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
                  return <div key={j} className="cube flex-container-column" onClick={() => selectCube(i, j)}>{cube.readonly ? cube.reality : cube.value}</div>
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
            return <button key={index} disabled={selectedCube === undefined} onClick={() => setNumberInCube(num)}>{num}</button>
          })
        }
      </div>
    </div>
  );
}

export default App;
