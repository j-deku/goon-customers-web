import { useState, useEffect, useRef, useCallback } from "react";

/**
 * CHANGES from the original:
 *
 * 1. The old version matched old/new driver arrays by ARRAY INDEX and
 *    assumed they were always the same length. That breaks the moment
 *    drivers are real: a driver can appear or disappear between polls
 *    (their location went stale, a different driver matched the route,
 *    etc.), so index-alignment silently animates the WRONG driver toward
 *    the wrong target once counts diverge.
 *
 * 2. The internal `setInterval(..., 5000)` that randomly jittered
 *    positions was explicitly a placeholder ("Simulate backend updates
 *    every 5s" per the original comment) — removed. Real movement now
 *    comes from whoever calls `animateTo` with fresh data (see
 *    useMatchedRideDrivers.js), which is expected to poll the backend
 *    itself and decide its own cadence.
 *
 * 3. The returned setter is now `animateTo(targetDrivers, duration?)`
 *    instead of a raw `setDrivers` — so callers can't accidentally skip
 *    the smooth interpolation by setting state directly. Each driver
 *    object needs a stable `id` field; everything else (lat, lng, plus
 *    any extra fields like name/avatar/price) is carried through.
 */

const getBearing = (start, end) => {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;
  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

const lerp = (start, end, t) => start + (end - start) * t;

export const useSmoothDriverAnimation = (initialDrivers = []) => {
  const [drivers, setDrivers] = useState(
    initialDrivers.map((d) => ({ ...d, rotation: 0 }))
  );

  // Always read the latest rendered positions, without making animateTo
  // depend on (and get recreated by) `drivers` changing every frame.
  const driversRef = useRef(drivers);
  useEffect(() => {
    driversRef.current = drivers;
  }, [drivers]);

  const animationFrameRef = useRef(null);

  const animateTo = useCallback((targetDrivers, duration = 1500) => {
    cancelAnimationFrame(animationFrameRef.current);

    const startById = new Map(driversRef.current.map((d) => [d.id, d]));

    // Drivers with no prior known position (just appeared) start exactly
    // at their target — there's nothing real to interpolate from.
    const startFrame = targetDrivers.map((target) => {
      const prev = startById.get(target.id);
      return prev
        ? { ...prev }
        : { ...target, rotation: 0 };
    });

    const targetById = new Map(targetDrivers.map((d) => [d.id, d]));
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setDrivers(
        startFrame.map((driver) => {
          const target = targetById.get(driver.id);
          if (!target) return driver;

          const lat = lerp(driver.lat, target.lat, progress);
          const lng = lerp(driver.lng, target.lng, progress);

          const hasMoved =
            driver.lat !== target.lat || driver.lng !== target.lng;

          return {
            ...driver,
            ...target, // carry through any extra fields (name, avatar, price, ...)
            lat,
            lng,
            rotation: hasMoved
              ? getBearing({ lat: driver.lat, lng: driver.lng }, target)
              : driver.rotation ?? 0,
          };
        })
      );

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return [drivers, animateTo];
};