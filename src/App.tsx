import React, { memo } from 'react';
import './App.css';

import { Map } from './components/Map';

const App = memo(() => {
  return (
    <Map />
  );
});

export { App };
