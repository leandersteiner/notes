import React from 'react';
import ReactDOM from 'react-dom';
import { Greet } from './Greet';

ReactDOM.render(
  <React.StrictMode>
    <Greet name="Leander" />
  </React.StrictMode>,
  document.getElementById('root')
);
