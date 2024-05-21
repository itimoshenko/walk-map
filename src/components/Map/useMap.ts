import { useEffect, useRef } from 'react';
import { Map as OLMap, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Layer from 'ol/layer/Layer';

import 'ol/ol.css';

type CreateMapOptions = {
  mapElement: HTMLDivElement | null;
  layers: Layer[];
  features: Feature[];
};

type UseMapProps = CreateMapOptions & {
  position: GeolocationPosition | null;
  rotation: number;
};

const createMap = (options: CreateMapOptions) => new OLMap({
  target: options.mapElement!,
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    ...options.layers,
    new VectorLayer({
      source: new VectorSource({
        features: options.features,
      }),
    }),
  ],
  view: new View({
    center: fromLonLat([37.6173, 55.7558]), // Centered on Moscow
    zoom: 17,
  }),
});

const useMap = (props: UseMapProps) => {
  const mapRef = useRef<OLMap | null>(null);

  // Map initialization
  useEffect(() => {
    if (mapRef.current || !props.mapElement) return;

    mapRef.current = createMap({
      mapElement: props.mapElement,
      layers: props.layers,
      features: props.features,
    });
  }, [props.features, props.layers, props.mapElement]);

  // Handle device rotation
  useEffect(() => {
    if (mapRef.current && props.rotation !== undefined) {
      mapRef.current.getView().setRotation(props.rotation);
    }
  }, [props.rotation]);

  // Handle geolocation
  useEffect(() => {
    const coordinates = props.position?.coords;

    if (mapRef.current && coordinates) {
      mapRef.current.getView().setCenter(fromLonLat([coordinates.longitude, coordinates.latitude]));
    }
  }, [props.position?.coords]);

  return mapRef.current;
};

export { useMap };
