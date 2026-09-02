import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchRides.css';
import {
  FaCheck,
  FaCircle,
  FaRegCircle,
  FaMotorcycle,
  FaStar,
} from 'react-icons/fa';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import {
  Box,
  Skeleton,
  Typography,
  Chip,
  Button,
  Grid,
  Alert,
  Avatar,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
//import { socket } from '../../Provider/UserSocketProvider';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axiosInstance';

const getDriverInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return '?';

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

// Helper to call Google Directions API via hidden map
const fetchRouteInfo = (serviceMap, origin, destination) =>
  new Promise((resolve, reject) => {
    const service = new window.google.maps.DirectionsService();
    service.route(
      { origin, destination, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === 'OK' && result.routes[0]?.legs?.[0]) {
          const leg = result.routes[0].legs[0];
          resolve({
            durationText: leg.duration.text,
            distanceText: leg.distance.text,
          });
        } else {
          reject(status);
        }
      }
    );
  });

const renderRideTypeIcon = (rideType) => {
  const type = rideType.toLowerCase();
  if (type === 'bus') return <DirectionsBusIcon style={{ fontSize: 32 }} />;
  if (type === 'motorcycle') return <FaMotorcycle size={32} />;
  if (type === 'car') return <AirportShuttleIcon style={{ fontSize: 32 }} />;
  return null;
};

export default function SearchRides({ sortOption, filterOption }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const getImageUrl = (url) => {
  if (!url) return '/default-ride.jpeg';

  // Already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Backend-relative URL
  return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};


  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [routeInfo, setRouteInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 // 1) Safely load searchData
  const searchData = useMemo(() => {
    const raw = location.state || localStorage.getItem('searchData');
    if (!raw) return null;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); }
      catch { return null; }
    }
    return raw;
  }, [location.state]);

 const stripAccents = (s = "") => 
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
      
  // — 2) Derive primitives for room‐join effect
  const pickupNorm = useMemo(
    () => searchData?.pickup ? stripAccents(searchData.pickup) : '',
    [searchData?.pickup]
  );
  const destNorm = useMemo(
    () => searchData?.destination ? stripAccents(searchData.destination) : '',
    [searchData?.destination]
  );
  const searchDate = useMemo(
    () => searchData?.selectedDate
      ? new Date(searchData.selectedDate).toISOString().split('T')[0]
      : '',
    [searchData?.selectedDate]
  );

  // 1) Fetch rides
useEffect(() => {
if (!searchData?.pickup || !searchData?.destination) return;

  const fetchRides = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        pickup: searchData.pickup,
        destination: searchData.destination,
        selectedDate: searchDate,
        sort: sortOption,
        filter: filterOption !== "all" ? filterOption : undefined,
        page: currentPage,
        limit: 10,
      };
      const res = await axiosInstance.get("/api/rides/search", { params });
      console.log("🔎 SEARCH PARAMS:", params);
      console.log("🔎 SEARCH RESPONSE:", res.data);
      console.log("🔎 RIDES:", res.data.rides);

      setRides(res.data.rides);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching rides");
    } finally {
      setLoading(false);
    }
  };

  fetchRides();
}, [ searchData?.pickup, searchData?.destination, searchData?.selectedDate, sortOption, filterOption, currentPage ]
);

   // 2) Join search room and listen for rideFull
 useEffect(() => {
if (!pickupNorm || !destNorm || !searchDate) return;

   //const roomPayload = { pickupNorm, destinationNorm: destNorm, date: searchDate };
   //socket.emit("joinSearchRoom", roomPayload);
/*
   const handleFull = ({ rideId }) => {
     setRides((prev) =>
       prev.map((r) =>
         r.id === rideId ? { ...r, isFull: true } : r
       )
     );
     // optional toast:
     toast.info("A ride just filled up — it’s now marked Full.");
   };
*/
   //socket.on("rideFull", handleFull);

   return () => {
     //socket.emit("leaveSearchRoom", roomPayload);
     //socket.off("rideFull", handleFull);
   };
 }, [pickupNorm, destNorm, searchDate]);

  // 2) Compute ETA & distance
  useEffect(() => {
    if (!rides.length || !window.google) return;
    const mapDiv = document.createElement('div');
    const serviceMap = new window.google.maps.Map(mapDiv);
    rides.forEach((ride) => {
      const origin = {
        lat: ride.pickupLocation.coordinates[1],
        lng: ride.pickupLocation.coordinates[0],
      };
      const destination = {
        lat: ride.destinationLocation.coordinates[1],
        lng: ride.destinationLocation.coordinates[0],
      };
      fetchRouteInfo(serviceMap, origin, destination)
        .then((info) =>
          setRouteInfo((prev) => ({ ...prev, [ride.id]: info }))
        )
        .catch(() => {});
    });
  }, [rides]);

  const handleSelectRide = (ride) => {
    // 1) Dispatch into Redux
    dispatch(addToCart(ride));
    navigate('/cart');
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString();
  };

const calculateEndTime = (start, duration) => {
  if (!start || !duration) return start || '--';

  const startParts = start.split(':').map(Number);

  if (
    startParts.length < 2 ||
    startParts.some(Number.isNaN)
  ) {
    return '--';
  }

  const startMinutes =
    startParts[0] * 60 + startParts[1];

  let durationMinutes = 0;

  // HH:MM or HH:MM:SS
  if (typeof duration === 'string' && duration.includes(':')) {
    const parts = duration.split(':').map(Number);

    if (parts.some(Number.isNaN)) {
      return '--';
    }

    durationMinutes =
      parts[0] * 60 + parts[1];
  }

  // "1h 30m", "2h", "45m"
  else if (typeof duration === 'string') {
    const hours =
      duration.match(/(\d+)\s*h/i);

    const minutes =
      duration.match(/(\d+)\s*m/i);

    durationMinutes =
      (hours ? Number(hours[1]) * 60 : 0) +
      (minutes ? Number(minutes[1]) : 0);
  }

  // Numeric duration → assume minutes
  else if (typeof duration === 'number') {
    durationMinutes = duration;
  }

  else {
    return '--';
  }

  if (!Number.isFinite(durationMinutes)) {
    return '--';
  }

  const totalMinutes =
    (startMinutes + durationMinutes) % (24 * 60);

  const endHour =
    Math.floor(totalMinutes / 60);

  const endMinute =
    totalMinutes % 60;

  return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
};

const formatDuration = (duration) => {
  if (!duration) return 'Duration N/A';

  if (typeof duration === 'number') {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return `${hours}h ${minutes}m`;
  }

  if (duration.includes(':')) {
    const parts = duration.split(':').map(Number);

    if (parts.some(Number.isNaN)) {
      return 'Duration N/A';
    }

    return `${parts[0]}h ${parts[1]}m`;
  }

  if (duration.match(/(\d+)\s*h/i) || duration.match(/(\d+)\s*m/i)) {
    return duration;
  }

  return 'Duration N/A';
};

  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  if (loading) {
    return (
      <Box className="skeleton-container">
        <Skeleton variant="text" width="60%" height={30} />
        {[...Array(2)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={200}
            sx={{ mb: 2 }}
          />
        ))}
      </Box>
    );
  }

  if (error) return <Typography color="error"><Alert severity='error'>{error}</Alert></Typography>;
  if (!rides.length) return <Typography sx={{fontWeight:"bold", p:3, fontSize:16}}><Alert sx={{ p:3, fontSize:16}} severity='info'>No rides found.</Alert></Typography>;

  return (
    <Box sx={{ p: 2 }} className="search-rides">
      <Typography variant="h5" gutterBottom>
        {formatDate(rides[0].selectedDate)}, {rides[0].pickup} → {rides[0].destination}
      </Typography>
      <Grid container spacing={2}>
        {rides.map((ride) => {
          const info = routeInfo[ride.id] || {};
          const endTime = ride.duration
            ? calculateEndTime(ride.selectedTime, ride.duration)
            : ride.selectedTime;
          return (
            <Grid item xs={12} md={6} lg={20} key={ride.id}>
              <Box className="ride-card">
                <Box display="flex" justifyContent="space-between" mb={1}>
                      {ride.isFull ? (
                      <Chip label="Full" color="error" />
                    ) : (
                      <Chip label="Available" color="success" />
                    )}
                  <Chip label={info.durationText || '--'} color="primary" />
                  <Chip label={info.distanceText || '--'} variant="outlined" />
                </Box>
                <Box className="ride-date">
                  <Typography>{formatDate(ride.selectedDate)}</Typography>
                  <Typography>
                    {ride.currency} {ride.price.toFixed(2)}
                  </Typography>
                </Box>
                <hr />
                <Box className="ride-info">
                  <Box display="flex" alignItems="center">
                    {renderRideTypeIcon(ride.type)}
                    <Typography sx={{ ml: 1 }}>{ride.type}</Typography>
                  </Box>
                  <img
                    src={getImageUrl(ride.imageUrl)}
                    alt="ride"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/default-ride.jpeg';
                    }}
                    className="ride-image"
                  />
                  {ride.driver && (
                    <Box className="driver-info">
                      <Avatar
                          src={
                            ride.driver?.avatar
                              ? getImageUrl(ride.driver.avatar)
                              : undefined
                          }
                          alt={ride.driver?.name || 'Driver'}
                          imgProps={{
                            onError: (event) => {
                              event.currentTarget.style.display = 'none';
                            },
                          }}
                          sx={{
                            width: 40,
                            height: 40,
                            mr:1,
                            fontSize: '1rem',
                            fontWeight: 600,
                          }}
                        >
                          {getDriverInitials(ride.driver?.name)}
                        </Avatar>

                      <Typography>
                        {ride.driver.name}
                      </Typography>
                    </Box>
                  )}
                  <FaCheck />
                  <Typography>
                    {ride.description} <FaStar /> 5.0
                  </Typography>
                </Box>
                <Box className="ride-timeline">
                  <Typography className="time-label">
                    {ride.selectedTime}
                  </Typography>
                  <FaCircle className="timeline-icon" />
                  <Box className="timeline-bar">
                    <Typography className="duration-label">
                      {formatDuration(ride.duration)}
                    </Typography>
                  </Box>
                  <FaRegCircle className="timeline-icon" />
                  <Typography className="time-label">
                    {endTime}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={ride.isFull}
                  onClick={() => handleSelectRide(ride)}
                  sx={{ mt: 1, background: 'linear-gradient(135deg, #4c4e52 40%, #020c1b 100%)' }}
                >
                  {ride.isFull ? "Full" : "Select"}
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Typography sx={{ mx: 2 }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
