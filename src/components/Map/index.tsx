import React, { useRef, memo, useMemo } from 'react';
import { get as getProjection } from 'ol/proj';
import { useMap } from './useMap';
import { useMapArrow } from './useArrow';
import { useWarFog } from './useWarFog';

type MapProps = {
  position: GeolocationPosition | null;
  positionPoints: GeolocationPosition[];
  rotation: number;
};

const PROJECTION_NAME = 'EPSG:3857';
const PROJECTION = getProjection(PROJECTION_NAME);

if (!PROJECTION) {
  throw new Error(`There is no projection for name [${PROJECTION_NAME}]`);
}

const EXTENT = PROJECTION.getExtent();

const Map: React.FC<MapProps> = memo(({ position, positionPoints, rotation }) => {
  const mapElementRef = useRef<HTMLDivElement>(null);

  const mapArrowFeature = useMapArrow({ position });
  const warFogLayer = useWarFog({ extent: EXTENT, positionPoints });

  const useMapProps = useMemo(() => ({
    mapElement: mapElementRef.current,
    layers: [warFogLayer],
    features: [mapArrowFeature],
    position,
    rotation,
  }), [mapArrowFeature, position, rotation, warFogLayer]);

  useMap(useMapProps);

  return (
    <div ref={mapElementRef} style={{ width: '100%', height: '100%' }} />
  );
});

export { Map };
export type { MapProps };
