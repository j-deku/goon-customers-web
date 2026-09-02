import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Paper,
  Button,
  Chip,
  Fab,
  Tooltip,
  CircularProgress,
  Avatar,
} from "@mui/material";

import {
  MdArrowBack,
  MdSwapVert,
  MdAccessTime,
  MdRoute,
  MdMyLocation,
  MdSearch,
  MdLocationOn,
  MdFlag,
  MdClose,
  MdLanguage,
  MdVerified,
} from "react-icons/md";

import {
  Map,
  AdvancedMarker,
  Circle,
  useMap,
} from "@vis.gl/react-google-maps";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useNavigate } from "react-router-dom";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";

import {
  LocalizationProvider,
} from "@mui/x-date-pickers/LocalizationProvider";

import {
  AdapterDateFns,
} from "@mui/x-date-pickers/AdapterDateFns";

import {
  DatePicker,
} from "@mui/x-date-pickers/DatePicker";

import { useSmoothDriverAnimation } from "../../hooks/useSmoothDriverAnimation/useSmoothDriverAnimation";

import PassengerSelector from "../PassengerSelector/PassengerSelector";

import useUserLocation from "../../hooks/UseUserLocation/UseUserLocation";
import useMatchedRideDrivers from "../../hooks/UseMatchedRideDrivers/UseMatchedRideDrivers"; // adjust to your actual path

import "./SearchAvailable.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    setOptions({
          key: GOOGLE_MAPS_API_KEY,
          v: "weekly",
        });

    await importLibrary("core");

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};


/* =========================================================
   MAP MARKERS
========================================================= */

const PickupPin = () => (
  <div className="pickup-pin">
    <div className="pickup-pin-inner" />
  </div>
);


const DestinationPin = () => (
  <div className="destination-pin">
    <div className="destination-pin-inner" />
  </div>
);


const UserLocationMarker = ({ position }) => {
  if (!position) return null;

  return (
    <AdvancedMarker
      position={position}
      title="Your current location"
      zIndex={950}
    >
      <div className="user-marker">
        <div className="user-location-pulse" />
        <div className="user-marker-dot" />
      </div>
    </AdvancedMarker>
  );
};


const UserAccuracyCircle = ({
  position,
  accuracy,
  warning,
}) => {
  if (!position || !accuracy) return null;

  return (
    <Circle
      center={position}
      radius={accuracy}
      options={{
        strokeColor: warning ? "#ef4444" : "#2563eb",
        strokeOpacity: 0.5,
        strokeWeight: 1.5,
        fillColor: warning ? "#ef4444" : "#2563eb",
        fillOpacity: 0.06,
        clickable: false,
      }}
    />
  );
};


/* =========================================================
   MAP INSTANCE
========================================================= */

const MapInstanceCapture = ({ mapRef }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      mapRef.current = map;
    }

    return () => {
      mapRef.current = null;
    };
  }, [map, mapRef]);

  return null;
};


/* =========================================================
   AUTO CENTER
========================================================= */

const AutoCenterOnUser = ({
  userPosition,
  skip,
}) => {
  const map = useMap();
  const centeredRef = useRef(false);

  useEffect(() => {
    if (
      !map ||
      !userPosition ||
      centeredRef.current ||
      skip
    ) {
      return;
    }

    map.panTo(userPosition);
    map.setZoom(15);

    centeredRef.current = true;
  }, [
    map,
    userPosition,
    skip,
  ]);

  return null;
};


/* =========================================================
   MAP BOUNDS
========================================================= */

const MapBoundsController = ({
  pickupCoords,
  destCoords,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps) {
      return;
    }

    if (pickupCoords && destCoords) {
      const bounds =
        new window.google.maps.LatLngBounds();

      bounds.extend(pickupCoords);
      bounds.extend(destCoords);

      map.fitBounds(bounds, {
        top: 180,
        bottom: 100,
        left: 80,
        right: 80,
      });

      return;
    }

    if (pickupCoords) {
      map.panTo(pickupCoords);
      map.setZoom(15);
      return;
    }

    if (destCoords) {
      map.panTo(destCoords);
      map.setZoom(15);
    }
  }, [
    map,
    pickupCoords,
    destCoords,
  ]);

  return null;
};


/* =========================================================
   ROUTE
========================================================= */

const RouteLine = ({
  origin,
  destination,
  onRouteInfo,
}) => {
  const map = useMap();

  const rendererRef = useRef(null);
  const serviceRef = useRef(null);

  useEffect(() => {
    if (!map || !window.google?.maps) {
      return;
    }

    if (!rendererRef.current) {
      rendererRef.current =
        new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,

          polylineOptions: {
            strokeColor: "#111827",
            strokeOpacity: 0.9,
            strokeWeight: 5,
          },
        });
    }

    rendererRef.current.setMap(map);

    if (!serviceRef.current) {
      serviceRef.current =
        new window.google.maps.DirectionsService();
    }

    return () => {
      rendererRef.current?.setMap(null);
    };
  }, [map]);


  useEffect(() => {
    if (
      !map ||
      !window.google?.maps ||
      !rendererRef.current ||
      !serviceRef.current
    ) {
      return;
    }

    if (!origin || !destination) {
      rendererRef.current.setDirections({
        routes: [],
      });

      onRouteInfo?.(null);

      return;
    }

    let cancelled = false;

    serviceRef.current.route(
      {
        origin,
        destination,

        travelMode:
          window.google.maps.TravelMode.DRIVING,

        drivingOptions: {
          departureTime: new Date(),
          trafficModel: "bestguess",
        },
      },

      (result, status) => {
        if (cancelled) return;

        if (
          status !== "OK" ||
          !result ||
          !rendererRef.current
        ) {
          onRouteInfo?.(null);
          return;
        }

        rendererRef.current.setDirections(result);

        const leg =
          result.routes?.[0]?.legs?.[0];

        if (!leg) {
          onRouteInfo?.(null);
          return;
        }

        const normalSeconds =
          leg.duration?.value ?? 0;

        const trafficSeconds =
          leg.duration_in_traffic?.value ??
          normalSeconds;

        onRouteInfo({
          distanceText:
            leg.distance?.text ?? "",

          durationText:
            leg.duration_in_traffic?.text ??
            leg.duration?.text ??
            "",

          trafficRatio:
            normalSeconds > 0
              ? trafficSeconds / normalSeconds
              : 1,
        });
      }
    );

    return () => {
      cancelled = true;
    };
  }, [
    map,
    origin,
    destination,
    onRouteInfo,
  ]);

  return null;
};


/* =========================================================
   TRAFFIC
========================================================= */

const getTrafficStatus = (ratio) => {
  if (ratio >= 1.4) {
    return {
      text: "Heavy traffic",
      className: "traffic-heavy",
    };
  }

  if (ratio >= 1.15) {
    return {
      text: "Moderate traffic",
      className: "traffic-moderate",
    };
  }

  return {
    text: "Light traffic",
    className: "traffic-light",
  };
};


/* =========================================================
   ROUTE INFO
========================================================= */

const RouteInfoCard = ({
  routeInfo,
}) => {
  if (!routeInfo) return null;

  const traffic =
    getTrafficStatus(
      routeInfo.trafficRatio
    );

  return (
    <Paper
      className="route-info-card"
      elevation={0}
    >
      <div className="route-info-icon">
        <MdAccessTime size={21} />
      </div>

      <div className="route-info-content">
        <Typography className="route-duration">
          {routeInfo.durationText}
        </Typography>

        <div className="route-info-meta">
          <span>
            <MdRoute size={14} />
            {routeInfo.distanceText}
          </span>

          <Chip
            label={traffic.text}
            className={traffic.className}
          />
        </div>
      </div>
    </Paper>
  );
};


/* =========================================================
   DRIVER — premium live marker
========================================================= */

const DriverIcon =
  import.meta.env.VITE_DRIVER_CAR_ICON;


const DriverMarker = ({
  driver,
  isSelected,
  onSelect,
}) => {
  const avatarUrl = getImageUrl(driver.avatar);

  return (
    <AdvancedMarker
      position={{
        lat: driver.lat,
        lng: driver.lng,
      }}
      title={driver.name || "Available driver"}
      zIndex={isSelected ? 960 : 700}
      onClick={() => onSelect(driver.id)}
    >
      <div className={`premium-driver-marker ${isSelected ? "is-selected" : ""}`}>
        <div className="premium-driver-pulse" />
        <div className="premium-driver-ring">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={driver.name || "driver"}
              className="premium-driver-avatar"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <img
              src={DriverIcon}
              alt="Available driver"
              draggable={false}
              className="premium-driver-car"
              style={{
                transform: `rotate(${driver.rotation || 0}deg)`,
              }}
            />
          )}
        </div>
        <div className="premium-driver-live-dot" />
      </div>
    </AdvancedMarker>
  );
};


/* =========================================================
   AMBIENT FOOTER — brand + route summary + live-driver count +
   trust badge, in one glass bar. Replaces the plainer
   MapFooterStatus. Shown only when no driver is selected;
   DriverInfoCard takes over the same visual "slot" (bottom-center)
   when one is tapped.
========================================================= */

const PremiumMapFooter = ({ routeInfo, driverCount, hasRoute }) => (
  <div className="premium-map-footer">
    <div className="premium-map-footer__inner">

      <div className="premium-map-footer__brand">
        <div className="premium-map-footer__brand-mark">G</div>
        <div>
          <Typography className="premium-map-footer__title">GoOn</Typography>
          <Typography className="premium-map-footer__subtitle">
            Verified rides, tracked live
          </Typography>
        </div>
      </div>

      <div className="premium-map-footer__divider" />

      <div className="premium-map-footer__item">
        <div className="premium-map-footer__status-icon">
          <MdRoute size={14} />
        </div>
        <div>
          <Typography className="premium-map-footer__item-label">ROUTE</Typography>
          <Typography className="premium-map-footer__item-value">
            {routeInfo
              ? `${routeInfo.distanceText} · ${routeInfo.durationText}`
              : "Set pickup & destination"}
          </Typography>
        </div>
      </div>

      <div className="premium-map-footer__divider" />

      <div className="premium-map-footer__item">
        <span className="premium-map-footer__live-dot" />
        <div>
          <Typography className="premium-map-footer__item-label">LIVE DRIVERS</Typography>
          <Typography className="premium-map-footer__item-value">
            {driverCount > 0
              ? `${driverCount} nearby on this route`
              : hasRoute
              ? "None live yet"
              : "Awaiting your route"}
          </Typography>
        </div>
      </div>

      <div className="premium-map-footer__divider" />

      <div className="premium-map-footer__trust">
        <div className="premium-map-footer__shield">
          <MdVerified size={15} />
        </div>
        <Typography className="premium-map-footer__item-value">
          Verified &amp; insured
        </Typography>
      </div>

    </div>
  </div>
);

const DriverInfoCard = ({ driver, onClose }) => {
  if (!driver) return null;

  return (
    <div className="driver-info-card">
      <Avatar
        src={getImageUrl(driver.avatar) || undefined}
        className="driver-info-avatar"
      >
        {(driver.name || "?").charAt(0).toUpperCase()}
      </Avatar>

      <div className="driver-info-body">
        <div className="driver-info-name-row">
          <Typography className="driver-info-name" noWrap>
            {driver.name || "Driver"}
          </Typography>
          <span className="driver-info-live-badge">
            <span className="driver-info-live-badge-dot" />
            LIVE
          </span>
        </div>
        {driver.price != null && (
          <Typography className="driver-info-price">
            From {driver.currency || ""} {Number(driver.price).toFixed(2)}
          </Typography>
        )}
      </div>

      <IconButton className="driver-info-close" size="small" onClick={onClose}>
        <MdClose size={16} />
      </IconButton>
    </div>
  );
};


const MapLegalFooter = () => (
  <div className="map-legal-footer">
    <div className="map-legal-footer-links">
      <span className="map-legal-footer-lang">
        <MdLanguage size={13} />
        Language · English
      </span>
      <span className="map-legal-footer-divider"> | </span>
      <span>Terms of use</span>
      <span className="map-legal-footer-divider"> | </span>
      <span>Privacy Policy</span>
    </div>
    <div className="map-legal-footer-copyright">
      © {new Date().getFullYear()} GoOn Technologies. GoOn is an information
      service — ride services are provided by independent third-party drivers.
    </div>
  </div>
);


/* =========================================================
   REVERSE GEOCODING
========================================================= */

const reverseGeocode = (
  coords,
  callback
) => {
  if (!window.google?.maps) return;

  const geocoder =
    new window.google.maps.Geocoder();

  geocoder.geocode(
    {
      location: coords,
    },

    (results, status) => {
      if (
        status === "OK" &&
        results?.[0]
      ) {
        callback(results[0]);
      }
    }
  );
};



/* =========================================================
   MAIN COMPONENT
========================================================= */

const SearchAvailable = () => {
  const navigate = useNavigate();

  const GOOGLE_MAP_ID =
    import.meta.env.VITE_GOOGLE_MAP_ID;

  const Maps_API_KEY =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


  /* ---------------- STATE ---------------- */

  const [center] = useState({
    lat: 5.6037,
    lng: -0.187,
  });

  const [pickup, setPickup] =
    useState(null);

  const [destination, setDestination] =
    useState(null);

  const [pickupCoords, setPickupCoords] =
    useState(null);

  const [destCoords, setDestCoords] =
    useState(null);

  const [tripDate, setTripDate] =
    useState(null);

  const [passengers, setPassengers] =
    useState(1);

  const [routeInfo, setRouteInfo] =
    useState(null);

  const [locating, setLocating] =
    useState(false);

  const [selectedDriverId, setSelectedDriverId] =
    useState(null);


  const mapInstanceRef =
    useRef(null);


  /* ---------------- USER LOCATION ---------------- */

  const {
    position: userPosition,
    accuracy: userAccuracy,
    accuracyWarning: userAccuracyWarning,
    locationError: userLocationError,
  } = useUserLocation();


  /* ---------------- DRIVERS ---------------- */

  // Real drivers behind rides matching the entered pickup/destination —
  // only ones with a fresh, trustworthy location (the backend already
  // filters out stale positions). No more fake demo dots.
  const [drivers, animateDriversTo] =
    useSmoothDriverAnimation([]);

  const pickupText =
    pickup?.label || pickup?.value?.description || null;
  const destinationText =
    destination?.label || destination?.value?.description || null;

  const matchedDrivers = useMatchedRideDrivers({
    pickup: pickupText,
    destination: destinationText,
    selectedDate: tripDate,
    enabled: !!(pickupText && destinationText),
    intervalMs: 8000,
  });

  useEffect(() => {
    animateDriversTo(matchedDrivers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedDrivers]);

  const selectedDriver =
    drivers.find((d) => d.id === selectedDriverId) || null;


  /* =====================================================
     ROUTE INFO
  ===================================================== */

  const handleRouteInfo =
    useCallback((info) => {
      setRouteInfo(info);
    }, []);


  /* =====================================================
     PLACE → COORDINATES
  ===================================================== */

  const getCoordsFromPlaceId =
    useCallback(
      (placeId, setCoords) => {
        if (!window.google?.maps || !placeId) {
          return;
        }

        const geocoder =
          new window.google.maps.Geocoder();

        geocoder.geocode(
          {
            placeId,
          },

          (results, status) => {
            if (
              status === "OK" &&
              results?.[0]?.geometry?.location
            ) {
              const location =
                results[0].geometry.location;

              setCoords({
                lat: location.lat(),
                lng: location.lng(),
              });
            }
          }
        );
      },
      []
    );


  /* =====================================================
     PICKUP
  ===================================================== */

  const handlePickupChange =
    (value) => {
      setPickup(value);

      if (!value) {
        setPickupCoords(null);
        return;
      }

      const placeId =
        value.value?.place_id;

      if (placeId) {
        getCoordsFromPlaceId(
          placeId,
          setPickupCoords
        );
      }
    };


  /* =====================================================
     DESTINATION
  ===================================================== */

  const handleDestinationChange =
    (value) => {
      setDestination(value);

      if (!value) {
        setDestCoords(null);
        return;
      }

      const placeId =
        value.value?.place_id;

      if (placeId) {
        getCoordsFromPlaceId(
          placeId,
          setDestCoords
        );
      }
    };


  /* =====================================================
     SWAP
  ===================================================== */

  const handleSwap = () => {
    setPickup(destination);
    setDestination(pickup);

    setPickupCoords(destCoords);
    setDestCoords(pickupCoords);
  };


  /* =====================================================
     CURRENT LOCATION
  ===================================================== */

  const handleUseCurrentLocation =
    () => {
      if (!userPosition) {
        return;
      }

      setLocating(true);

      // Immediately use the accurate GPS
      // coordinates.
      setPickupCoords(
        userPosition
      );

      reverseGeocode(
        userPosition,
        (result) => {
          const address =
            result.formatted_address;

          setPickup({
            label: address,

            value: {
              place_id:
                result.place_id,

              description:
                address,
            },
          });

          setLocating(false);
        }
      );
    };


  /* =====================================================
     LOCATE ME
  ===================================================== */

  const handleLocateMe = () => {
    const map =
      mapInstanceRef.current;

    if (!map || !userPosition) {
      return;
    }

    map.panTo(userPosition);

    setTimeout(() => {
      map.setZoom(16);
    }, 150);
  };


  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = () => {
    if (
      !pickup ||
      !destination ||
      !tripDate ||
      !pickupCoords ||
      !destCoords
    ) {
      alert(
        "Please complete your pickup, destination, date and passenger details."
      );

      return;
    }

    const searchData = {
      pickup:
        pickup.label ||
        pickup.value?.description ||
        pickup.description ||
        pickup,

      destination:
        destination.label ||
        destination.value?.description ||
        destination.description ||
        destination,

      selectedDate:
        tripDate,

      passengers,

      pickupCoords,

      destCoords,

      routeInfo,
    };

    localStorage.setItem(
      "searchData",
      JSON.stringify(searchData)
    );

    navigate(
      "/searchRides",
      {
        state: searchData,
      }
    );
  };


  /* =====================================================
     AUTOCOMPLETE STYLES
  ===================================================== */

  const autocompleteStyles = {
    control: (
      provided,
      state
    ) => ({
      ...provided,

      minHeight: "54px",

      borderRadius: "15px",

      border:
        state.isFocused
          ? "1.5px solid #111827"
          : "1px solid #e5e7eb",

      boxShadow:
        state.isFocused
          ? "0 0 0 4px rgba(17,24,39,.07)"
          : "none",

      background:
        "#f9fafb",

      cursor: "text",

      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),

    valueContainer: (
      provided
    ) => ({
      ...provided,
      padding:
        "4px 14px",
    }),

    placeholder: (
      provided
    ) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),

    singleValue: (
      provided
    ) => ({
      ...provided,
      color: "#111827",
      fontSize: "14px",
      fontWeight: 500,
    }),

    menu: (
      provided
    ) => ({
      ...provided,
      zIndex: 99999,
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow:
        "0 20px 50px rgba(0,0,0,.18)",
    }),

    option: (
      provided,
      state
    ) => ({
      ...provided,

      padding:
        "13px 15px",

      fontSize: "14px",

      backgroundColor:
        state.isFocused
          ? "#f3f4f6"
          : "#fff",

      color: "#111827",

      cursor: "pointer",
    }),
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Box className="search-page">

      {/* ================= MAP ================= */}

      <Box className="map-layer">

        <Map
          mapId={GOOGLE_MAP_ID}
          defaultCenter={
            userPosition || center
          }
          defaultZoom={14}
          gestureHandling="greedy"
          style={{
            width: "100%",
            height: "100%",
          }}
        >

          <MapInstanceCapture
            mapRef={mapInstanceRef}
          />

          <AutoCenterOnUser
            userPosition={userPosition}
            skip={
              !!(
                pickupCoords ||
                destCoords
              )
            }
          />

          <MapBoundsController
            pickupCoords={
              pickupCoords
            }
            destCoords={
              destCoords
            }
          />

          <RouteLine
            origin={pickupCoords}
            destination={destCoords}
            onRouteInfo={
              handleRouteInfo
            }
          />


          {/* USER */}

          {userPosition && (
            <>
              <UserAccuracyCircle
                position={
                  userPosition
                }
                accuracy={
                  userAccuracy
                }
                warning={
                  userAccuracyWarning
                }
              />

              <UserLocationMarker
                position={
                  userPosition
                }
              />
            </>
          )}


          {/* PICKUP */}

          {pickupCoords && (
            <AdvancedMarker
              position={
                pickupCoords
              }
              draggable
              title="Pickup location"
              onDragEnd={(event) => {
                if (!event.latLng)
                  return;

                setPickupCoords({
                  lat:
                    event.latLng.lat(),

                  lng:
                    event.latLng.lng(),
                });
              }}
            >
              <PickupPin />
            </AdvancedMarker>
          )}


          {/* DESTINATION */}

          {destCoords && (
            <AdvancedMarker
              position={
                destCoords
              }
              draggable
              title="Destination"
              onDragEnd={(event) => {
                if (!event.latLng)
                  return;

                setDestCoords({
                  lat:
                    event.latLng.lat(),

                  lng:
                    event.latLng.lng(),
                });
              }}
            >
              <DestinationPin />
            </AdvancedMarker>
          )}


          {/* DRIVERS */}

          {drivers.map(
            (driver) => (
              <DriverMarker
                key={driver.id}
                driver={driver}
                isSelected={driver.id === selectedDriverId}
                onSelect={setSelectedDriverId}
              />
            )
          )}

        </Map>


        {/* LOCATE ME */}

        {userPosition && (
          <Tooltip
            title="Center on my location"
            placement="left"
          >
            <Fab
              className="locate-button"
              size="medium"
              onClick={
                handleLocateMe
              }
            >
              <MdMyLocation
                size={21}
              />
            </Fab>
          </Tooltip>
        )}


        {/* BOTTOM-CENTER SLOT — DriverInfoCard when a driver is
            tapped, otherwise the ambient PremiumMapFooter */}

        {selectedDriver ? (
          <Box className="map-bottom-overlay">
            <DriverInfoCard
              driver={selectedDriver}
              onClose={() => setSelectedDriverId(null)}
            />
          </Box>
        ) : (
          <PremiumMapFooter
            routeInfo={routeInfo}
            driverCount={drivers.length}
            hasRoute={!!(pickupText && destinationText)}
          />
        )}

        <MapLegalFooter />

      </Box>


      {/* ================= HEADER ================= */}

      <AppBar
        className="search-header"
        position="absolute"
        elevation={0}
      >

        <Toolbar className="search-toolbar">

          <Box
            className="brand"
            onClick={() =>
              navigate("/")
            }
          >
            GoOn
          </Box>


          <Box className="header-title">
            <span>PLAN YOUR RIDE</span>
            <small>
              Choose where you're going
            </small>
          </Box>


          <IconButton
            className="back-button"
            onClick={() =>
              navigate(-1)
            }
            aria-label="Go back"
          >
            <MdArrowBack
              size={23}
            />
          </IconButton>

        </Toolbar>
      </AppBar>


      {/* ================= ROUTE INFO ================= */}

      <Box className="route-info-wrapper">
        <RouteInfoCard
          routeInfo={
            routeInfo
          }
        />
      </Box>


      {/* ================= SEARCH CARD ================= */}

      <Paper
        className="search-card"
        elevation={0}
      >

        {/* CARD HEADER */}

        <div className="search-card-header">

          <div className="search-card-icon">
            <MdSearch size={22} />
          </div>

          <div>
            <Typography className="search-card-title">
              Find a ride
            </Typography>

            <Typography className="search-card-subtitle">
              Tell us where you want to go
            </Typography>
          </div>

        </div>


        {/* LOCATIONS */}

        <div className="location-section">

          {/* PICKUP */}

          <div className="field-group">

            <div className="field-label">
              <span className="field-dot pickup-dot" />
              Pickup
            </div>

            <div className="autocomplete-wrapper">

              <GooglePlacesAutocomplete
                apiKey={
                  Maps_API_KEY
                }

                selectProps={{
                  value: pickup,
                  onChange:
                    handlePickupChange,

                  placeholder:
                    "Where should we pick you up?",

                  isClearable: true,

                  styles:
                    autocompleteStyles,
                }}

                autocompletionRequest={{
                  componentRestrictions: {
                    country: [
                      "gh",
                    ],
                  },
                }}
              />

              {userPosition && (
                <button
                  type="button"
                  className="current-location-button"
                  onClick={
                    handleUseCurrentLocation
                  }
                  disabled={
                    locating
                  }
                >
                  {locating ? (
                    <CircularProgress
                      size={14}
                    />
                  ) : (
                    <MdMyLocation
                      size={15}
                    />
                  )}

                  <span>
                    {locating
                      ? "Locating..."
                      : "Use my location"}
                  </span>
                </button>
              )}

            </div>

          </div>


          {/* SWAP */}

          <div className="swap-row">

            <div className="route-line" />

            <IconButton
              onClick={
                handleSwap
              }
              className="swap-button"
              aria-label="Swap pickup and destination"
            >
              <MdSwapVert
                size={22}
              />
            </IconButton>

            <div className="route-line" />

          </div>


          {/* DESTINATION */}

          <div className="field-group">

            <div className="field-label">
              <span className="field-dot destination-dot" />
              Destination
            </div>

            <div className="autocomplete-wrapper">

              <GooglePlacesAutocomplete
                apiKey={
                  Maps_API_KEY
                }

                selectProps={{
                  value:
                    destination,

                  onChange:
                    handleDestinationChange,

                  placeholder:
                    "Where are you going?",

                  isClearable: true,

                  styles:
                    autocompleteStyles,
                }}

                autocompletionRequest={{
                  componentRestrictions: {
                    country: [
                      "gh",
                    ],
                  },
                }}
              />

            </div>

          </div>

        </div>


        {/* DETAILS */}

        <div className="trip-details">

          <div className="date-field">

            <label>
              Travel date
            </label>

            <LocalizationProvider
              dateAdapter={
                AdapterDateFns
              }
            >

              <DatePicker
                value={tripDate}
                onChange={
                  setTripDate
                }

                disablePast

                slotProps={{
                  textField: {
                    fullWidth: true,

                    placeholder:
                      "Select date",

                    size: "small",

                    sx: {
                      "& .MuiOutlinedInput-root":
                        {
                          minHeight:
                            "54px",

                          borderRadius:
                            "15px",

                          background:
                            "#f9fafb",
                        },
                    },
                  },
                }}
              />

            </LocalizationProvider>

          </div>


          <div className="passenger-field">

            <label>
              Passengers
            </label>

            <PassengerSelector
              value={
                passengers
              }

              setValue={
                setPassengers
              }

              min={1}
              max={6}
            />

          </div>

        </div>


        {/* ERROR */}

        {userLocationError && (
          <div className="location-notice">
            <MdLocationOn
              size={16}
            />

            <span>
              Location access is
              unavailable. You can
              still enter your pickup
              manually.
            </span>
          </div>
        )}


        {/* SEARCH BUTTON */}

        <Button
          className="search-button"
          fullWidth
          onClick={
            handleSearch
          }

          startIcon={
            <MdSearch
              size={21}
            />
          }
        >
          Search available rides
        </Button>


        <div className="search-footer">

          <MdFlag
            size={14}
          />

          <span>
            Drag the map pins to fine-tune
            your locations
          </span>

        </div>

      </Paper>

    </Box>
  );
};

export default SearchAvailable;