import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from '@material-ui/core';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={createMuiTheme()}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);