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
    let successfulSolutions = 0;
    let unsuccessfuleSolutions = 0;
    const sols: Array<number[][]> = [];

    for (let i = 0; i < 1000; i++) {
      try {
        let dummy = sudoku.generateSudokuSolution();
        successfulSolutions += 1;
        sols.push(dummy);
  
      } catch (err: any) {
        unsuccessfuleSolutions += 1;
        // console.log(err.message);
      }
    }


    console.log('successful', successfulSolutions);
    console.log('unsuccessful', unsuccessfuleSolutions);
    console.log(sols);
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
