import { useEffect, useRef } from 'react';
import { Feature } from 'ol';
import { Style, Fill } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Polygon, { fromCircle } from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';
import { Extent } from 'ol/extent';

type Coordinates = {
  longitude: number;
  latitude: number;
};

type UseWarFogProps = {
  extent: Extent;
  points: Coordinates[];
};

const createWarFogFeature = (extent: Extent) => {
  const outerPolygon = new Polygon([[
    [extent[0], extent[1]],
    [extent[0], extent[3]],
    [extent[2], extent[3]],
    [extent[2], extent[1]],
    [extent[0], extent[1]],
  ]]);

  const warFogFeature = new Feature(outerPolygon);

  warFogFeature.setStyle(new Style({
    fill: new Fill({
      color: 'rgba(128, 128, 128, 0.9)',
    }),
  }));

  return warFogFeature;
};

const updateWarFogFeatureGeometry = (extent: Extent, warFogFeature: Feature<Polygon>) => {
  const outerPolygon = new Polygon([[
    [extent[0], extent[1]],
    [extent[0], extent[3]],
    [extent[2], extent[3]],
    [extent[2], extent[1]],
    [extent[0], extent[1]],
  ]]);

  const centerOfMoscow = fromLonLat([37.6173, 55.7558]);
  const radius = 250; // Радиус 250 метров

  const innerCircle = new Circle(centerOfMoscow, radius);
  const innerPolygon = fromCircle(innerCircle, 64); // Преобразование круга в полигон

  const linearRing = innerPolygon.getLinearRing(0);

  if (linearRing) {
    outerPolygon.appendLinearRing(linearRing);
  }

  warFogFeature.setGeometry(outerPolygon);
};

const createWarFogLayer = (warFogHolesFeature: Feature<Polygon>) => {
  const vectorSource = new VectorSource<Polygon>();

  vectorSource.addFeature(warFogHolesFeature);

  return new VectorLayer({
    source: vectorSource,
  });
};

const useWarFog = (props: UseWarFogProps): VectorLayer<VectorSource<Polygon>> => {
  const warFogFeatureRef = useRef<Feature<Polygon>>(
    createWarFogFeature(props.extent),
  );
  const warFogLayerRef = useRef<VectorLayer<VectorSource<Polygon>>>(
    createWarFogLayer(warFogFeatureRef.current),
  );

  useEffect(() => {
    const warFogFeature = warFogFeatureRef.current;

    updateWarFogFeatureGeometry(props.extent, warFogFeature);
  }, [props.extent]);

  return warFogLayerRef.current;
};

export { useWarFog };
