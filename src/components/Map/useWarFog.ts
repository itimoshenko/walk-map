import { useState } from 'react';
import { Feature } from 'ol';
import { Style, Fill } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Polygon from 'ol/geom/Polygon';
import { fromCircle } from 'ol/geom/Polygon';
import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';

const useWarFog = (extent: [number, number, number, number]): VectorLayer<VectorSource<Polygon>> => {
  const [warFogLayer] = useState(() => {
    const vectorSource = new VectorSource<Polygon>();

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

    console.log(linearRing);

    if (linearRing) {
      outerPolygon.appendLinearRing(linearRing);
    }

    const warFogFeature = new Feature(outerPolygon);

    warFogFeature.setStyle(new Style({
      fill: new Fill({
        color: 'rgba(128, 128, 128, 0.9)', // Серый цвет
      }),
    }));

    vectorSource.addFeature(warFogFeature);

    return new VectorLayer({
      source: vectorSource,
    });
  });

  return warFogLayer;
};

export { useWarFog };
