type TrackGeolocationOptions = {
  successCallback: PositionCallback;
  errorCallback: (error: unknown) => void;
};

type UntrackGeolocation = () => void;

type TrackGeolocationReturnType = {
  untrackGeolocation: UntrackGeolocation;
};

const trackGeolocation = async ({
  successCallback,
  errorCallback,
}: TrackGeolocationOptions): Promise<TrackGeolocationReturnType> => {
  let geoWatchId: number | null = null;
  let permissionStatus: PermissionStatus | null = null;

  const handlePermissionChange = () => {
    throw new Error('Geolocation permission changed');
  };

  const untrackGeolocation = () => {
    if (geoWatchId) {
      navigator.geolocation.clearWatch(geoWatchId);
    }

    permissionStatus?.removeEventListener('change', handlePermissionChange);
  };

  try {
    permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

    if (permissionStatus.state === 'granted') {
      geoWatchId = navigator.geolocation.watchPosition(successCallback, errorCallback);
    } else if (permissionStatus.state === 'prompt') {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else if (permissionStatus.state === 'denied') {
      throw new Error('Geolocation permission denied');
    }

    permissionStatus.addEventListener('change', handlePermissionChange);
  } catch (err) {
    errorCallback(new Error(`Track geolocation error [${err}]`));

    untrackGeolocation();
  }

  return {
    untrackGeolocation,
  };
};

export { trackGeolocation };
export type { TrackGeolocationOptions, TrackGeolocationReturnType, UntrackGeolocation };
