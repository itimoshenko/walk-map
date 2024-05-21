import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useLogger } from '../components/Logger';

const useDeviceRotation = (): { rotation: number | null; trackOrientation: () => void; } => {
  const [rotation, setRotation] = useState<number | null>(null);

  const { log } = useLogger();

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      const newRotation = (event.alpha * Math.PI) / 180 + Math.PI;
      setRotation(newRotation);
    }
  }, []);

  const trackOrientation = useCallback(() => {
    // @ts-ignore
    if (!DeviceOrientationEvent?.requestPermission) {
      window.addEventListener('deviceorientation', handleOrientation);

      return;
    }

    // @ts-ignore
    DeviceOrientationEvent.requestPermission()
      .then((response: any) => {
        log(`DeviceOrientationEvent response [${response}]`);

        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      })
      .catch((error: any) => {
        log(`DeviceOrientationEvent error [${error}]`);
      });
  }, [handleOrientation, log]);

  useEffect(() => () => {
    window.removeEventListener('deviceorientation', handleOrientation);
  }, [handleOrientation]);

  const result = useMemo(() => ({ rotation, trackOrientation }), [rotation, trackOrientation]);

  return result;
};

export { useDeviceRotation };
