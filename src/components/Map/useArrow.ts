import { useState, useEffect } from 'react';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';

const useArrow = (coordinates: { latitude: number; longitude: number; heading?: number } | null, rotation: number): Feature<Point> | null => {
  const [userFeature] = useState(() => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([0, 0])),
    });
    feature.setStyle(new Style({
      image: new Icon({
        src: 'arrow.png', // Путь к изображению стрелки
        anchor: [0.5, 1],
        scale: 0.25, // Уменьшить размер стрелки в 4 раза
        rotateWithView: true,
      }),
    }));
    return feature;
  });

  useEffect(() => {
    if (coordinates && userFeature) {
      const geometry = userFeature.getGeometry() as Point;
      geometry.setCoordinates(fromLonLat([coordinates.longitude, coordinates.latitude]));

      const style = userFeature.getStyle() as Style;
      if (style && style.getImage()) {
        const image = style.getImage() as Icon;
        if (coordinates.heading !== null && coordinates.heading !== undefined) {
          image.setRotation((coordinates.heading * Math.PI) / 180 - rotation);
        }
      }
    }
  }, [coordinates, userFeature, rotation]);

  return userFeature;
};

export { useArrow };
