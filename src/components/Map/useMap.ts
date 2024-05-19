import { useEffect, useRef, MutableRefObject } from 'react';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import 'ol/ol.css';

const useMap = (mapElementRef: MutableRefObject<HTMLDivElement | null>, userFeature?: Feature<Geometry> | null, coordinates?: { latitude: number, longitude: number } | null, rotation?: number, darkOverlayLayer?: VectorLayer<VectorSource<Geometry>>) => {
  const mapRef = useRef<OLMap | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapElementRef.current) return; // Initialize map only once

    const layers: (TileLayer<OSM> | VectorLayer<VectorSource<Geometry>>)[] = [
      new TileLayer({
        source: new OSM(),
      }),
    ];

    if (darkOverlayLayer) {
      layers.push(darkOverlayLayer);
    }

    if (userFeature) {
      const vectorSource = new VectorSource({
        features: [userFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      layers.push(vectorLayer);
    }

    mapRef.current = new OLMap({
      target: mapElementRef.current,
      layers,
      view: new View({
        center: fromLonLat([37.6173, 55.7558]), // Centered on Moscow, for example
        zoom: 17, // Установить начальный зум для масштаба 17
      }),
    });
  }, [mapElementRef, userFeature, darkOverlayLayer]);

  useEffect(() => {
    if (mapRef.current && rotation !== undefined) {
      mapRef.current.getView().setRotation(rotation);
    }
  }, [rotation]);

  useEffect(() => {
    if (mapRef.current && coordinates) {
      mapRef.current.getView().setCenter(fromLonLat([coordinates.longitude, coordinates.latitude]));
    }
  }, [coordinates]);

  return mapRef.current;
};

export { useMap };
