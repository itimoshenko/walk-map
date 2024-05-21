import React, {
  memo, useCallback, useEffect, useState,
} from 'react';
import './App.css';

import { Map } from './components/Map';
import { useGeolocationPosition } from './hooks/useGeolocation';
import { useDeviceRotation } from './hooks/useDeviceRotation';
import { useLogger } from './components/Logger';

const usePositionPoints = (position: GeolocationPosition | null): GeolocationPosition[] => {
  const [positionPoints, setPositionPoints] = useState<GeolocationPosition[]>([]);

  useEffect(() => {
    if (!position) return;

    setPositionPoints((prevPositionPoints) => [...prevPositionPoints, position]);
  }, [position]);

  return positionPoints;
};

const App = memo(() => {
  const { position, error, track: handleTrack } = useGeolocationPosition();
  const positionPoints = usePositionPoints(position);
  const { rotation, trackOrientation: handleTrackOrientation } = useDeviceRotation();

  const { getLogs } = useLogger();
  const [isLogsVisible, setIsLogsVisible] = useState(false);

  const handleToggleLogsVisibility = useCallback(() => {
    setIsLogsVisible((prev) => !prev);
  }, []);

  // log(
  //   `position:
  //     timestamp [${position?.timestamp ? new Date(position?.timestamp).toISOString() : position?.timestamp}],
  //     longitude [${position?.coords.longitude}],
  //     longitude [${position?.coords.latitude}],
  //     heading [${position?.coords.heading}],
  //     speed [${position?.coords.speed}]
  //   `,
  // );
  // log(`position error: [${JSON.stringify(error, null, 2)}]`);
  // log(`position points length: [${positionPoints.length}]`);
  // log(`rotation: [${rotation}]`);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Map position={position} positionPoints={positionPoints} rotation={rotation} />
      {error ? (
        <div style={{
          position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '5px', color: 'red',
        }}
        >
          {`Error: [${new Error(error as any)}]`}
          <button type="button" onClick={handleTrack} style={{ marginLeft: '10px', padding: '5px 10px' }}>
            Request Permission Again
          </button>
        </div>
      ) : null}

      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 10,
        right: 10,
        background: 'rgba(255,255,255,0.8)',
        padding: '10px',
        borderRadius: '5px',
        color: 'red',
        overflow: 'scroll',
        maxHeight: '85%',
      }}
      >
        {isLogsVisible && (
        <div>
          <h2>Logs:</h2>
          <ul>
            {getLogs().map((logEntry, i) => (
              <li key={i}>
                {`${logEntry.timestamp}:${logEntry.message}`}
              </li>
            ))}
          </ul>
        </div>
        )}
        <button type="button" onClick={handleToggleLogsVisibility} style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Show Logs
        </button>
        <button type="button" onClick={handleTrackOrientation} style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Track orientation
        </button>
      </div>
    </div>
  );
});

export { App };
