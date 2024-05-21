import { useEffect, useRef } from 'react';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';

type UseMapArrowProps = {
  position: GeolocationPosition | null;
};

const createMapArrowFeature = () => {
  const ICON_SRC = 'arrow.png';
  const ICON_SCALE = 0.25;

  const feature = new Feature({
    geometry: new Point(fromLonLat([0, 0])),
  });

  feature.setStyle(new Style({
    image: new Icon({
      src: ICON_SRC,
      scale: ICON_SCALE,
      rotateWithView: true,
    }),
  }));

  return feature;
};

const useMapArrow = (props: UseMapArrowProps): Feature<Point> => {
  const mapArrowFeatureRef = useRef<Feature<Point>>(createMapArrowFeature());

  useEffect(() => {
    if (props.position) {
      const mapArrowFeature = mapArrowFeatureRef.current;
      const mapArrowGeometry = mapArrowFeature.getGeometry()!;
      const coordinates = props.position.coords;

      mapArrowGeometry.setCoordinates(fromLonLat([coordinates.longitude, coordinates.latitude]));
    }
  }, [props.position]);

  return mapArrowFeatureRef.current;
};

export { useMapArrow };
export type { UseMapArrowProps };
