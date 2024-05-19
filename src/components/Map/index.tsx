import React, { useRef, memo } from 'react';
import { useMap } from './useMap';
import { useGPSPosition } from './useGPSPosition';
import { useArrow } from './useArrow';
import { useDeviceRotation } from './useDeviceRotation';
import { useDarkOverlay } from './useDarkOverlay';
import { useWarFog } from './useWarFog';
import { get as getProjection } from 'ol/proj';

const Map: React.FC = memo(() => {
  const mapElement = useRef<HTMLDivElement>(null);
  const { coordinates, error, requestPermission } = useGPSPosition();
  const rotation = useDeviceRotation();
  const userFeature = useArrow(coordinates, rotation);

  const projection = getProjection('EPSG:3857');
  const extent = projection?.getExtent() ?? [0, 0, 1000000, 1000000];
  const darkOverlayLayer = useDarkOverlay(extent as [number, number, number, number]);
  const warFogLayer = useWarFog(extent as [number, number, number, number]);

  useMap(mapElement, userFeature, coordinates, rotation, darkOverlayLayer, warFogLayer);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapElement} style={{ width: '100%', height: '100%' }}></div>
      {error && (
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '5px', color: 'red' }}>
          Error: {error}
          <button onClick={requestPermission} style={{ marginLeft: '10px', padding: '5px 10px' }}>
            Request Permission Again
          </button>
        </div>
      )}
    </div>
  );
});

export { Map };
