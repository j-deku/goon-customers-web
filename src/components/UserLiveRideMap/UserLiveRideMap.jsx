import React, { useState, useEffect, useCallback} from "react";
import { GoogleMap, Polyline, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectUserId } from "../../features/user/userSlice";
//import { socket } from "../../Provider/UserSocketProvider";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const libraries = ["places"];

export default function UserLiveRideMap() {
  const userId = useSelector(selectUserId);
  const [map, setMap] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null); 
  const [routePath, setRoutePath] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoadMap = useCallback((mapInstance) => setMap(mapInstance), []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserPos({ lat: coords.latitude, lng: coords.longitude }),
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);
/*
  useEffect(() => {
    if (!userId) return;
    socket.emit("joinUserRoom", userId);

    socket.on("rideStarted", () => {
      toast.info("Your driver is on the way!");
    });

    socket.on("updateDriverLocation", ({ lat, lng }) => {
      const pos = { lat, lng };
      setRoutePath((path) => [...path, pos]);

      if (driverMarker && map) {
        const from = driverMarker.getPosition();
        const toLat = lat;
        const toLng = lng;
        let start = null;

        const animate = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / 500, 1);
          const newLat = from.lat() + (toLat - from.lat()) * progress;
          const newLng = from.lng() + (toLng - from.lng()) * progress;
          driverMarker.setPosition({ lat: newLat, lng: newLng });
          map.panTo({ lat: newLat, lng: newLng });
          if (progress < 1) {
            window.requestAnimationFrame(animate);
          }
        };
        window.requestAnimationFrame(animate);
      }
    });

    socket.on("rideCompleted", ({ fare }) => {
      toast.success(`Ride complete! Fare: $${fare.toFixed(2)}`);
      setRoutePath([]);
      if (driverMarker) driverMarker.setMap(null);
    });

    return () => {
      socket.off("rideStarted");
      socket.off("updateDriverLocation");
      socket.off("rideCompleted");
    };
  }, [userId, map, driverMarker]); // Add driverMarker to dependencies
*/
  const onLoadDriverMarker = useCallback((markerInstance) => {
    setDriverMarker(markerInstance);
  }, []);

  if (loadError) return <div>Error loading map.</div>;
  if (!isLoaded || !userPos) return <div>Loading map…</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userPos}
      zoom={15}
      onLoad={onLoadMap}
    >
      <Marker position={userPos} label="You" />
      <Marker
        position={routePath[0] || userPos}
        icon={{
          url: "/car.png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        }}
        onLoad={onLoadDriverMarker} // <-- Use onLoad to get the instance
      />
      {routePath.length > 1 && (
        <Polyline
          path={routePath}
          options={{ strokeColor: "#1e88e5", strokeOpacity: 0.7, strokeWeight: 4 }}
        />
      )}
    </GoogleMap>
  );
}