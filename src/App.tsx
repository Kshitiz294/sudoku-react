import React, { useEffect, useState } from 'react';
import './App.css';
import * as sudoku from './generator';

function App() {
  const [gameBoard, setGameBoard] = useState<Array<number[]>>([]);
  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    const board: Array<number[]> = [];
    for(let i = 0; i < 9; i++) {
      let row: number[] = [];
      for (let j = 0; j < 9; j++) {
        row.push(0);
      }
      board.push(row);
    }

    setGameBoard(board);

    // Testing sudoku generator
    let dummy = sudoku.initializeEmptyBoard();

    try {
      // dummy = sudoku.generateSudokuSolution();

      // dummy = sudoku.fillTriplets(dummy, 3, 0);
      // dummy = sudoku.fillTriplets(dummy, 3, 1);
      // dummy = sudoku.fillTriplets(dummy, 3, 2);

      dummy = sudoku.fillNumberInBoard(dummy, 1);
      dummy = sudoku.fillNumberInBoard(dummy, 2);
      dummy = sudoku.fillNumberInBoard(dummy, 3);
      dummy = sudoku.fillNumberInBoard(dummy, 4);
      dummy = sudoku.fillNumberInBoard(dummy, 5);
      dummy = sudoku.fillNumberInBoard(dummy, 6);
      dummy = sudoku.fillNumberInBoard(dummy, 7);
      dummy = sudoku.fillNumberInBoard(dummy, 8);
      dummy = sudoku.fillNumberInBoard(dummy, 9);
    } catch (err: any) {
      console.log(err.message);
    }

    console.log(dummy);
  }, []);

  return (
    <div className="App flex-container-column">

      {/* Game Board */}
      {
        gameBoard.map((row: number[]) => {
          return (
            <div className="flex-container-row">
              {
                row.map((n: number) => {
                  return <div className="cube flex-container-column"></div>
                })
              }
            </div>
          );
        })
      }

      {/* Buttons */} 
      <div className="flex-container-row" style={{marginTop: '20px', width: '288px', justifyContent: 'space-between'}}>
        {
          numberButtons.map((num: number) => {
            return <button>{num}</button>
          })
        }
      </div>
    </div>
  );
}

export default App;
