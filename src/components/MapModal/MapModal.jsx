import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const MapModal = ({
  open, // control visibility
  onClose,
  mapCenter,
  mapPosition,
  handleMapClick,
  mapField,
  currentAddress,
  GOOGLE_MAP_ID,
  apiKey,
  onMarkerDragEnd,
  getAddressFromCoords,
  setPickup,
  setPickupCoords,
  setDestination,
  setDestCoords,
}) => {
  if (!open) return null; // Don't render if not open

  const handleConfirmLocation = async () => {
    if (mapPosition) {
      try {
        const address = await getAddressFromCoords(mapPosition);
        if (mapField === "pickup") {
          setPickup(address);
          setPickupCoords(mapPosition);
        } else {
          setDestination(address);
          setDestCoords(mapPosition);
        }
      } catch (error) {
        console.error("Error confirming location:", error);
      }
    }
    onClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* 1️⃣ Top Bar */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          backgroundColor: "white",
          zIndex: 2,
        }}
      >
        <Typography variant="h6">Select Location</Typography>
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </Box>

      {/* 2️⃣ Full-Screen Map */}
      <Box sx={{ flexGrow: 1, position: "relative", zIndex: 1 }}>
        <APIProvider apiKey={apiKey}>
          <Map
            mapId={GOOGLE_MAP_ID}
            center={mapCenter || { lat: 5.6037, lng: -0.1870 }} // Default Accra
            zoom={14}
            gestureHandling="greedy"
            style={{ width: "100%", height: "100%" }}
            onClick={handleMapClick}
          >
            {mapPosition && (
              <Marker
                position={mapPosition}
                draggable={true}
                onDragEnd={onMarkerDragEnd}
              />
            )}
          </Map>
        </APIProvider>

        {/* Floating Address Box */}
        <Box
          sx={{
            position: "absolute",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(255,255,255,0.9)",
            p: 1,
            borderRadius: 1,
            boxShadow: 1,
            textAlign: "center",
            minWidth: "200px",
          }}
        >
          <Typography variant="body2">
            {currentAddress || "Loading address..."}
          </Typography>
        </Box>
      </Box>

      {/* 3️⃣ Confirm Button */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "1px solid #eee",
          backgroundColor: "white",
          zIndex: 2,
        }}
      >
        <Button variant="contained" onClick={handleConfirmLocation}>
          Confirm Location
        </Button>
      </Box>
    </Box>
  );
};

export default MapModal;
