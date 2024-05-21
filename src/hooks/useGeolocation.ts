import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { UntrackGeolocation, trackGeolocation } from '../utils/trackGeolocation';

type GeolocationPositionReturnType = {
  position: GeolocationPosition | null;
  error: unknown;
  track: () => void;
  untrack: () => void;
};

const useGeolocationPosition = (): GeolocationPositionReturnType => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<unknown>(null);
  const untrackRef = useRef<UntrackGeolocation | null>(null);

  const untrack = useCallback(() => {
    if (untrackRef.current) {
      untrackRef.current();
    }
  }, []);

  const track = useCallback(async () => {
    untrack();

    const result = await trackGeolocation({
      successCallback: setPosition,
      errorCallback: setError,
    });

    untrackRef.current = result.untrackGeolocation;

    return untrackRef.current;
  }, [untrack]);

  useEffect(() => {
    track();

    return () => {
      if (untrackRef.current) {
        untrackRef.current();
      }
    };
  }, [track]);

  useEffect(() => {
    if (position) {
      setError(null);
    }
  }, [position]);

  const result = useMemo(() => ({
    position,
    error,
    track,
    untrack,
  }), [position, error, track, untrack]);

  return result;
};

export { useGeolocationPosition };
export type { GeolocationPositionReturnType };
