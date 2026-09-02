import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Box, Paper, Typography } from "@mui/material";

export default function SearchFormContent({
  pickupCoords,
  setPickupCoords,
  destCoords,
  setDestCoords,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handlePickupChange = (value) => {
    if (value?.value?.place_id) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId: value.value.place_id }, (results, status) => {
        if (status === "OK" && results[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          setPickupCoords({ lat: loc.lat(), lng: loc.lng() });
        }
      });
    }
  };

  const handleDestChange = (value) => {
    if (value?.value?.place_id) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId: value.value.place_id }, (results, status) => {
        if (status === "OK" && results[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          setDestCoords({ lat: loc.lat(), lng: loc.lng() });
        }
      });
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{ p: 2, borderRadius: 3, width: { xs: "90vw", sm: 350 } }}
    >
      <Box mb={2}>
        <Typography variant="subtitle2">Pickup Location</Typography>
        <GooglePlacesAutocomplete
          apiKey={apiKey}
          selectProps={{
            onChange: handlePickupChange,
            placeholder: "Enter pickup...",
          }}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2">Destination</Typography>
        <GooglePlacesAutocomplete
          apiKey={apiKey}
          selectProps={{
            onChange: handleDestChange,
            placeholder: "Enter destination...",
          }}
        />
      </Box>
    </Paper>
  );
}
