import React, { memo } from 'react';
import './App.css';

import { Map } from './components/Map';
import { useGeolocationPosition } from './hooks/useGeolocation';
import { useDeviceRotation } from './hooks/useDeviceRotation';

const App = memo(() => {
  const { position, error, track } = useGeolocationPosition();
  const rotation = useDeviceRotation();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Map position={position} rotation={rotation} />
      {error ? (
        <div style={{
          position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '5px', color: 'red',
        }}
        >
          Error: [error]
          <button type="button" onClick={track} style={{ marginLeft: '10px', padding: '5px 10px' }}>
            Request Permission Again
          </button>
        </div>
      ) : null}
    </div>
  );
});

export { App };
