import { useEffect, useState } from 'react';

const useDeviceRotation = (): number => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        const newRotation = (event.alpha * Math.PI) / 180;
        setRotation(newRotation);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return rotation;
};

export { useDeviceRotation };
