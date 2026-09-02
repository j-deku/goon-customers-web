import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Divider,
  Grow,
  Fade,
  Paper,
} from "@mui/material";
import {
  MdOutlineCalendarMonth,
  MdOutlineLocationOn,
  MdPersonOutline,
  MdOutlineSwapVert,
  MdRemoveCircleOutline,
  MdAddCircleOutline,
} from "react-icons/md";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PlaceAutocompleteInput from "../PlaceAutocompleteInput/PlaceAutocompleteInput";

const SearchFormContent = ({
  pickup,
  setPickup,
  destination,
  setDestination,
  selectedDate,
  setSelectedDate,
  passengers,
  setPassengers,
  handleSwap,
  handleSearch,
  loadingSearch,
  updateCoords,
  setPickupCoords,
  setDestCoords,
  handleMapOpen,
}) => {
  const [activeField, setActiveField] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grow in timeout={500}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          elevation={6}
          sx={{
            width: { xs: "360px", sm: "400px" },
            bgcolor: "white",
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            transition: "0.3s",
          }}
        >
          <Stack spacing={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, textAlign: "center", mb: 1, color: "#0e2445" }}
            >
              Find Your Ride
            </Typography>

            {/* Pickup */}
            <Box sx={{ position: "relative" }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: activeField === "pickup" ? "primary.main" : "text.secondary",
                  mb: 0.5,
                  fontWeight: activeField === "pickup" ? 600 : 400,
                  transition: "0.2s",
                }}
              >
                <MdOutlineLocationOn style={{ verticalAlign: "middle", marginRight: 4 }} />
                Pickup Location
              </Typography>
              <PlaceAutocompleteInput
                value={pickup}
                onFocus={() => setActiveField("pickup")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => {
                  setPickup(e.target.value);
                  updateCoords(e.target.value, setPickupCoords);
                }}
                placeholder="Enter pickup location"
                onPlaceSelected={(place) => {
                  setPickup(place.formattedAddress);
                  setPickupCoords(place.geometry.location.toJSON());
                }}
              />
              <Button
                size="small"
                variant="text"
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "primary.main",
                  minWidth: "auto",
                  pr: 1,
                }}
                onClick={() => handleMapOpen("pickup")}
              >
                Map
              </Button>
            </Box>

            {/* Swap Button */}
            <Fade in timeout={400}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton
                  onClick={handleSwap}
                  aria-label="swap locations"
                  sx={{
                    bgcolor: "white",
                    border: "2px solid",
                    borderColor: "primary.light",
                    color: "primary.main",
                    width: 48,
                    height: 48,
                    transition: "0.2s",
                    "&:hover": { bgcolor: "primary.light", color: "white" },
                  }}
                >
                  <MdOutlineSwapVert size={24} />
                </IconButton>
              </Box>
            </Fade>

            {/* Destination */}
            <Box sx={{ position: "relative" }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: activeField === "destination" ? "primary.main" : "text.secondary",
                  mb: 0.5,
                  fontWeight: activeField === "destination" ? 600 : 400,
                  transition: "0.2s",
                }}
              >
                <MdOutlineLocationOn style={{ verticalAlign: "middle", marginRight: 4 }} />
                Destination
              </Typography>
              <PlaceAutocompleteInput
                value={destination}
                onFocus={() => setActiveField("destination")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => {
                  setDestination(e.target.value);
                  updateCoords(e.target.value, setDestCoords);
                }}
                placeholder="Enter destination"
                onPlaceSelected={(place) => {
                  setDestination(place.formattedAddress);
                  setDestCoords(place.geometry.location.toJSON());
                }}
              />
              <Button
                size="small"
                variant="text"
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "primary.main",
                  minWidth: "auto",
                  pr: 1,
                }}
                onClick={() => handleMapOpen("destination")}
              >
                Map
              </Button>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Date & Passengers */}
            <Stack direction="row" spacing={1.5}>
              {/* Date */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                  <MdOutlineCalendarMonth style={{ verticalAlign: "middle", marginRight: 4 }} />
                  Date
                </Typography>
                <DesktopDatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 7 * 86400000)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: { sx: { borderRadius: 2 } },
                    },
                  }}
                />
              </Box>

              {/* Passengers */}
              <Box sx={{ flex: 0.5 }}>
                <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                  <MdPersonOutline style={{ verticalAlign: "middle", marginRight: 4 }} />
                  Passengers
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    p: "6px 12px",
                  }}
                >
                  <IconButton
                    type="button"
                    disabled={passengers <= 1}
                    onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                    sx={{ color: "primary.main", "&.Mui-disabled": { color: "action.disabled" } }}
                  >
                    <MdRemoveCircleOutline size={24} />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {passengers}
                  </Typography>
                  <IconButton
                    type="button"
                    disabled={passengers >= 50}
                    onClick={() => setPassengers((p) => p + 1)}
                    sx={{ color: "primary.main", "&.Mui-disabled": { color: "action.disabled" } }}
                  >
                    <MdAddCircleOutline size={24} />
                  </IconButton>
                </Box>
              </Box>
            </Stack>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 3,
                backgroundColor: "#0e2445",
                "&:hover": {
                  backgroundColor: "#193b74",
                },
              }}
              disabled={loadingSearch}
            >
              {loadingSearch ? "Searching..." : "Find Rides"}
            </Button>
          </Stack>
        </Paper>
      </Grow>
    </LocalizationProvider>
  );
};

export default SearchFormContent;
