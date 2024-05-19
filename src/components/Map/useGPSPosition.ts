import { useEffect, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  heading?: number;
}

const useGPSPosition = (): { coordinates: Coordinates | null; error: string | null; requestPermission: () => void } => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestGeolocationPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

      const handlePermissionChange = () => {
        if (permissionStatus.state === 'granted') {
          startTracking();
        } else {
          setError('Geolocation permission denied');
        }
      };

      if (permissionStatus.state === 'granted') {
        startTracking();
      } else if (permissionStatus.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          () => {
            startTracking();
          },
          (err) => {
            setError(err.message);
          }
        );
      } else {
        setError('Geolocation permission denied');
      }

      permissionStatus.onchange = handlePermissionChange;
    } catch (err) {
      setError('Geolocation permission not supported');
    }
  };

  const startTracking = () => {
    const geoWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading } = position.coords;
        setCoordinates({ latitude, longitude, heading: heading !== null ? heading : undefined });
      },
      (err) => {
        setError(err.message);
      }
    );

    return () => {
      navigator.geolocation.clearWatch(geoWatchId);
    };
  };

  useEffect(() => {
    requestGeolocationPermission();
  }, []);

  return { coordinates, error, requestPermission: requestGeolocationPermission };
};

export { useGPSPosition };
