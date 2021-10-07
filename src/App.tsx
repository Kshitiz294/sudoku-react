import { AppBar, Box, Button, Grid, ThemeProvider, Toolbar, Typography } from '@material-ui/core';
import { Backspace } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import './App.scss';
import * as sudoku from './generator';
import { Cube } from './models/cube';
import { NumberButton } from './models/number-button';
import { theme } from './theme';

function App() {
  const [gameBoard, setGameBoard] = useState<Array<Cube[]>>([]);
  const [selectedrowIndex, setSelectedRowIndex] = useState<number | undefined>(undefined);
  const [selectedcolumnIndex, setSelectedColumnIndex] = useState<number | undefined>(undefined);
  const [disableButtons, setDisableButtons] = useState<boolean>(true);
  const [newGame, setNewGame] = useState<boolean>(true);
  const [numberButtons, setNumberButtons] = useState<Array<NumberButton>>([]);

  // To Initialize the game
  useEffect(() => {
    if (newGame) {
      setGameBoard(sudoku.createSudoku());
      
      // To Trigger change in newGame
      setNewGame(false);
    }
  }, [newGame]);

  // Initialize Number Buttons
  useEffect(() => {
    const buttons: NumberButton[] = [];
    for (let i = 1; i < 10; i++) {
      buttons.push({ value: i, occurance: 0 });
    }

    gameBoard.forEach((row: Cube[]) => {
      row.forEach((c: Cube) => {
        if (c.value && c.value === c.reality) {
          buttons[c.value - 1].occurance += 1;
        }
      });
    });
    setNumberButtons(buttons);
  }, [gameBoard]);

  // Disable/Enable Number buttons
  useEffect(() => {
    if (selectedrowIndex === undefined || selectedcolumnIndex === undefined) {
      setDisableButtons(true);
    } else if (gameBoard[selectedrowIndex][selectedcolumnIndex].readonly) {
      setDisableButtons(true);
    } else {
      setDisableButtons(false);
    }
  }, [selectedrowIndex, selectedcolumnIndex, gameBoard])

  // Select a cube
  const selectCube = (rowIndex: number, columnIndex: number): void => {
    setSelectedRowIndex(rowIndex);
    setSelectedColumnIndex(columnIndex);
  }

  // Set a number in cube
  const setNumberInCube = (n: number): void => {
    if (selectedrowIndex !== undefined && selectedcolumnIndex !== undefined) {
      if (!gameBoard[selectedrowIndex][selectedcolumnIndex].readonly) {
        gameBoard[selectedrowIndex][selectedcolumnIndex].value = n;
        const board = [...gameBoard];
        setGameBoard(board);
      }
    }
  }

  // Check if this cube's value is affected by the selected cube
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

  // Add Classes to cubes
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

  // Clear number from group
  const clearSelection = () => {
    if (selectedrowIndex === undefined || selectedcolumnIndex === undefined) {
      return;
    }

    if(!gameBoard[selectedrowIndex][selectedcolumnIndex].readonly) {
      delete gameBoard[selectedrowIndex][selectedcolumnIndex].value;
      const board = [...gameBoard];
      setGameBoard(board);
    } 
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="App" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div">
              React-Sudoku
            </Typography>
            <Button style={{ position: 'absolute', right: '20px' }} color="inherit" onClick={() => setNewGame(true)}>New Game</Button>
          </Toolbar>
        </AppBar>
        <Grid container justifyContent="center" spacing={4} xs={12}>
          {/* Game Board */}
          <Grid item container style={{width: '402px'}} justifyContent="flex-end">
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
          </Grid>

          {/* Buttons */} 
          <Grid item container spacing={1} xs={2} style={{marginTop: '20px'}}>
            {
              numberButtons.map((num: NumberButton, index: number) => {
                return (
                  <Grid item xs={4} key={index}>
                    <Button variant="outlined" className="control-button" disabled={disableButtons || num.occurance === 9} onClick={() => setNumberInCube(num.value)}>{num.value}</Button>
                  </Grid>
                )
              })
            }
            
            <Grid item justifyContent="center" xs={12}>
              <Button variant="outlined" className="control-button" disabled={disableButtons} onClick={clearSelection}>
                <Backspace/>
              </Button>
            </Grid>

            {/* <Grid item justifyContent="center" xs={6}>
              <Button variant="outlined" className="control-button" disabled={disableButtons} onClick={clearSelection}>
                New Game
              </Button>
            </Grid> */}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
