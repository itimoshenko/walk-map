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

  const handlePermissionChange = (event: Event) => {
    if (event.target instanceof PermissionStatus) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      track(event.target);
    }
  };

  const untrackGeolocation = () => {
    if (geoWatchId) {
      navigator.geolocation.clearWatch(geoWatchId);
    }

    permissionStatus?.removeEventListener('change', handlePermissionChange);
  };

  function track(_permissionStatus: PermissionStatus) {
    untrackGeolocation();

    if (_permissionStatus.state === 'granted') {
      geoWatchId = navigator.geolocation.watchPosition(successCallback, errorCallback);
    } else if (_permissionStatus.state === 'prompt') {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }

    _permissionStatus.addEventListener('change', handlePermissionChange);

    permissionStatus = _permissionStatus;
  }

  try {
    permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

    if (permissionStatus.state === 'denied') {
      throw new Error('Geolocation permission denied');
    }

    track(permissionStatus);
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
