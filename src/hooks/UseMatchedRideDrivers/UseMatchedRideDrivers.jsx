import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../axiosInstance"; // adjust to your actual relative path

/**
 * useMatchedRideDrivers
 * -----------------------
 * Polls GET /api/rides/search for the entered pickup/destination and
 * extracts the unique drivers behind the matching rides, keeping only
 * those with a fresh `driverLocation` (the backend already excludes stale
 * positions — see RideController::buildDriverLocationPayload — so
 * anything present here is trustworthy to show as "live").
 *
 * A driver can have multiple matching rides; only one marker per driver
 * is kept (the first match's price/ride is carried along for the info
 * card — good enough for "here's roughly what riding with them costs",
 * not meant to be authoritative once they actually pick a ride).
 */
export default function useMatchedRideDrivers({
  pickup,
  destination,
  selectedDate,
  enabled = true,
  intervalMs = 8000,
}) {
  const [drivers, setDrivers] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !pickup || !destination) {
      setDrivers([]);
      return;
    }

    let cancelled = false;

    const fetchMatches = async () => {
      try {
        const params = { pickup, destination, limit: 20 };
        if (selectedDate) {
          params.selectedDate = new Date(selectedDate).toISOString().split("T")[0];
        }

        const res = await axiosInstance.get("/api/rides/search", { params });
        if (cancelled) return;

        const rides = res.data?.rides || [];
        const byDriverId = new Map();

        for (const ride of rides) {
          const driver = ride.driver;
          const loc = ride.driverLocation;

          if (!driver || !loc || byDriverId.has(driver.id)) continue;

          byDriverId.set(driver.id, {
            id: driver.id,
            name: driver.name,
            avatar: driver.avatar,
            lat: loc.lat,
            lng: loc.lng,
            locationUpdatedAt: loc.updatedAt,
            rideId: ride.id,
            price: ride.price,
            currency: ride.currency,
          });
        }

        setDrivers(Array.from(byDriverId.values()));
      } catch (err) {
        console.error("Failed to load matched ride drivers", err);
      }
    };

    fetchMatches();
    timerRef.current = setInterval(fetchMatches, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, [pickup, destination, selectedDate, enabled, intervalMs]);

  return drivers;
}