import { useEffect, useRef, useState } from "react";

// Same quality tiers as the driver-side hook, used here only to decide
// how strongly to warn the user their fix is rough — there's no backend
// broadcast to gate on this panel, so unlike useDriverLocation every fix
// is accepted for the UI immediately.
const EXCELLENT_ACCURACY = 20;
const GOOD_ACCURACY = 50;

/**
 * useUserLocation
 * -----------------
 * Live browser geolocation for the passenger-facing search page. Always
 * updates `position` as soon as any fix arrives (see the note in
 * useDriverLocation about why gating the UI on accuracy leaves the map
 * stuck on devices without GPS) — `accuracyWarning` just tells the caller
 * whether to visually flag the fix as rough, it never withholds it.
 */
const useUserLocation = () => {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [accuracyWarning, setAccuracyWarning] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    let mounted = true;

    const processLocation = (pos) => {
      if (!mounted) return;

      const { latitude, longitude, accuracy } = pos.coords;

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      setLocationError(null);
      setAccuracy(accuracy);
      setAccuracyWarning(accuracy > GOOD_ACCURACY);
      setPosition({ lat: latitude, lng: longitude });
    };

    const handleError = (error) => {
      if (!mounted) return;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationError("Location permission was denied.");
          break;
        case error.POSITION_UNAVAILABLE:
          setLocationError("Your device could not determine your location.");
          break;
        case error.TIMEOUT:
          setLocationError("Location request timed out.");
          break;
        default:
          setLocationError("Unable to determine your current location.");
      }
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000,
    };

    navigator.geolocation.getCurrentPosition(processLocation, handleError, options);
    watchIdRef.current = navigator.geolocation.watchPosition(
      processLocation,
      handleError,
      options
    );

    return () => {
      mounted = false;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return {
    position,
    accuracy,
    accuracyWarning,
    locationError,
    isExcellent: accuracy != null && accuracy <= EXCELLENT_ACCURACY,
  };
};

export default useUserLocation;