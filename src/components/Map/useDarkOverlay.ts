import { useState } from 'react';
import { Feature } from 'ol';
import { Style, Fill } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Polygon from 'ol/geom/Polygon';

const useDarkOverlay = (extent: [number, number, number, number]): VectorLayer<VectorSource<Polygon>> => {
  const [darkOverlayLayer] = useState(() => {
    const vectorSource = new VectorSource<Polygon>();

    const darkOverlayFeature = new Feature(new Polygon([[
      [extent[0], extent[1]],
      [extent[0], extent[3]],
      [extent[2], extent[3]],
      [extent[2], extent[1]],
      [extent[0], extent[1]],
    ]]));

    darkOverlayFeature.setStyle(new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.5)',
      }),
    }));

    vectorSource.addFeature(darkOverlayFeature);

    return new VectorLayer({
      source: vectorSource,
    });
  });

  return darkOverlayLayer;
};

export { useDarkOverlay };
