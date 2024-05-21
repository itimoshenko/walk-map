import React, { memo, useEffect, useState } from 'react';
import './App.css';

import { Map } from './components/Map';
import { useGeolocationPosition } from './hooks/useGeolocation';
import { useDeviceRotation } from './hooks/useDeviceRotation';

const usePositionPoints = (position: GeolocationPosition | null): GeolocationPosition[] => {
  const [positionPoints, setPositionPoints] = useState<GeolocationPosition[]>([]);

  useEffect(() => {
    if (!position) return;

    setPositionPoints((prevPositionPoints) => [...prevPositionPoints, position]);
  }, [position]);

  return positionPoints;
};

const App = memo(() => {
  const { position, error, track } = useGeolocationPosition();
  const positionPoints = usePositionPoints(position);
  const rotation = useDeviceRotation();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Map position={position} positionPoints={positionPoints} rotation={rotation} />
      {error ? (
        <div style={{
          position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '5px', color: 'red',
        }}
        >
          {`Error: [${new Error(error as any)}]`}
          <button type="button" onClick={track} style={{ marginLeft: '10px', padding: '5px 10px' }}>
            Request Permission Again
          </button>
        </div>
      ) : null}
    </div>
  );
});

export { App };
