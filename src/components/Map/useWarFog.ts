import { useEffect, useRef } from 'react';
import { Feature } from 'ol';
import { Style, Fill } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Polygon, { fromCircle } from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';
import { Extent } from 'ol/extent';

import 'ol/ol.css';

import * as jsts from 'jsts';
import {
  Geometry, LineString, LinearRing, MultiLineString, MultiPoint, MultiPolygon, Point,
} from 'ol/geom';

type UseWarFogProps = {
  extent: Extent;
  positionPoints: GeolocationPosition[];
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

const updateWarFogFeatureGeometry = (
  extent: Extent,
  warFogFeature: Feature<Geometry>,
  positionPoints: GeolocationPosition[],
) => {
  if (!positionPoints.length) return;

  const VIEW_RADIUS = 150; // 250 метров

  // Создаем внешний полигон
  const outerPolygon = new Polygon([[
    [extent[0], extent[1]],
    [extent[0], extent[3]],
    [extent[2], extent[3]],
    [extent[2], extent[1]],
    [extent[0], extent[1]],
  ]]);

  const parser = new jsts.io.OL3Parser();
  (parser as any).inject(
    Point,
    LineString,
    LinearRing,
    Polygon,
    MultiPoint,
    MultiLineString,
    MultiPolygon,
  );

  // Конвертируем внешний полигон в геометрию JSTS
  const jstsOuterPolygon = parser.read(outerPolygon);

  // Создаем пустую геометрию для объединения
  let combinedGeometry: jsts.geom.Geometry | null = null;

  positionPoints.forEach((position) => {
    const coordinates = fromLonLat([position.coords.longitude, position.coords.latitude]);

    // Создаем круг и преобразуем его в полигон
    const innerCircle = new Circle(coordinates, VIEW_RADIUS);
    const innerPolygon = fromCircle(innerCircle, 64); // Преобразование круга в полигон

    // Конвертируем внутренний полигон в геометрию JSTS
    const jstsInnerPolygon = parser.read(innerPolygon);

    if (combinedGeometry === null) {
      combinedGeometry = jstsInnerPolygon;
    } else {
      combinedGeometry = combinedGeometry.union(jstsInnerPolygon);
    }
  });

  // Выполняем вычитание объединенной геометрии из внешнего полигона
  const difference = jstsOuterPolygon.difference(combinedGeometry!);

  // Конвертируем результат обратно в геометрию OpenLayers
  const differenceGeometry: Geometry = parser.write(difference);

  // Устанавливаем обновленную геометрию в feature
  warFogFeature.setGeometry(differenceGeometry);
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

    updateWarFogFeatureGeometry(props.extent, warFogFeature, props.positionPoints);
  }, [props.extent, props.positionPoints]);

  return warFogLayerRef.current;
};

export { useWarFog };
