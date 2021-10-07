import { createTheme, ThemeOptions } from '@material-ui/core';

const themeOptions: ThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
};

export const theme  = createTheme(themeOptions);
