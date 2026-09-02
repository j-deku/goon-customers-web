import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  DirectionsCar,
  LocationOn,
  Flag,
  People,
  CalendarToday,
  AccessTime,
  Payments,
  CheckCircle,
  Cancel,
  HourglassTop,
  ArrowForward,
  Route,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosInstance";

const STATUS_CONFIG = {
  PENDING_APPROVAL: {
    label: "Pending Approval",
    color: "warning",
    icon: <HourglassTop fontSize="small" />,
  },

  APPROVED: {
    label: "Approved",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },

  DECLINED: {
    label: "Declined",
    color: "error",
    icon: <Cancel fontSize="small" />,
  },

  CANCELLED: {
    label: "Cancelled",
    color: "error",
    icon: <Cancel fontSize="small" />,
  },

  IN_PROGRESS: {
    label: "In Progress",
    color: "info",
    icon: <DirectionsCar fontSize="small" />,
  },

  COMPLETED: {
    label: "Completed",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },

  PARTIALLY_APPROVED: {
    label: "Partially Approved",
    color: "info",
    icon: <CheckCircle fontSize="small" />,
  },
};

/**
 * Convert API status values into a consistent format.
 */
const normalizeStatus = (status) => {
  if (!status) {
    return "";
  }

  return String(status)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/**
 * Convert pickup/destination data into something displayable.
 */
const formatLocation = (location) => {
  if (!location) {
    return "Unknown location";
  }

  if (typeof location === "string") {
    return location;
  }

  if (typeof location === "object") {
    return (
      location.address ||
      location.name ||
      location.formattedAddress ||
      location.description ||
      location.placeName ||
      "Location unavailable"
    );
  }

  return String(location);
};

/**
 * Format money safely.
 */
const formatAmount = (amount, currency) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency || ""} 0.00`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "GHS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency || ""} ${numericAmount.toFixed(2)}`;
  }
};

/**
 * Format date.
 */
const formatDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};


const DEFAULT_RIDE_IMAGE = "/car-budget.jpeg";

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://goon-backend.com";

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return DEFAULT_RIDE_IMAGE;
  }

  const value = imageUrl.trim();

  if (!value) {
    return DEFAULT_RIDE_IMAGE;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  return `${BACKEND_URL}/${value}`;
};

export default function BookingCard({
  booking,
  onTrack,
  onRefresh,
}) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

const rides = useMemo(
  () => Array.isArray(booking?.rides)
    ? booking.rides
    : [], 
  [booking?.rides]
);

  const bookingStatus = normalizeStatus(booking?.status);

  const statusConfig =
    STATUS_CONFIG[bookingStatus] ||
    {
      label: booking?.status || "Unknown",
      color: "default",
      icon: null,
    };

  /**
   * A booking is trackable when at least one ride
   * is currently in progress.
   */
  const inProgress = useMemo(() => {
    return rides.some(
      (ride) =>
        normalizeStatus(ride?.status) === "IN_PROGRESS"
    );
  }, [rides]);

  /**
   * Total passengers across all rides.
   */
  const totalPassengers = useMemo(() => {
    return rides.reduce((total, ride) => {
      const passengers = Number(ride?.passengers || 0);

      return total + (
        Number.isFinite(passengers)
          ? passengers
          : 0
      );
    }, 0);
  }, [rides]);

  /**
   * First ride is used as the visual preview.
   */
const primaryRide = rides[0];

const image = resolveImageUrl(
  primaryRide?.imageUrl
);

  const pickup =
    formatLocation(primaryRide?.pickup);

  const destination =
    formatLocation(primaryRide?.destination);

  /**
   * Cancel booking.
   */
  const handleCancel = async () => {
    if (!booking?.id) {
      toast.error("Invalid booking ID.");
      return;
    }

    setCancelling(true);

    try {
      await axiosInstance.post(
        `/api/user/booking/${booking.id}/cancel`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Booking cancelled successfully.");

      setCancelDialogOpen(false);

      await onRefresh();
    } catch (err) {
      console.error(
        "Cancel booking error:",
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  /**
   * Determine whether cancellation is allowed.
   */
  const canCancel = [
    "PENDING_APPROVAL",
    "APPROVED",
  ].includes(bookingStatus);

  return (
    <>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          transition:
            "transform .25s ease, box-shadow .25s ease",

          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 14px 35px rgba(0,0,0,0.12)",
          },
        }}
      >
        {/* -------------------------------------------------- */}
        {/* IMAGE / HEADER */}
        {/* -------------------------------------------------- */}

        <Box
          sx={{
            position: "relative",
            height: 190,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={`${pickup} to ${destination}`}
            onError={(event) => {
                  if (event.currentTarget.src.endsWith(DEFAULT_RIDE_IMAGE)) {
                    return;
                  }
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = DEFAULT_RIDE_IMAGE;
                }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,0))",
            }}
          />

          {/* Booking status */}
          <Box
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
            }}
          >
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              size="small"
              sx={{
                fontWeight: 700,
                backdropFilter: "blur(8px)",
              }}
            />
          </Box>

          {/* Booking ID */}
          <Box
            sx={{
              position: "absolute",
              bottom: 14,
              left: 16,
              right: 16,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,.75)",
                display: "block",
              }}
            >
              Booking #{booking?.id}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {rides.length === 1
                ? "Ride Booking"
                : `${rides.length} Ride Booking`}
            </Typography>
          </Box>
        </Box>

        {/* -------------------------------------------------- */}
        {/* CONTENT */}
        {/* -------------------------------------------------- */}

        <CardContent
          sx={{
            flexGrow: 1,
            p: 2.5,
          }}
        >
          {/* Route */}
          {primaryRide && (
            <Box sx={{ mb: 2 }}>
              <Stack spacing={1.2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.2,
                  }}
                >
                  <LocationOn
                    sx={{
                      color: "#0A4D68",
                      mt: 0.2,
                    }}
                    fontSize="small"
                  />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      PICKUP
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {pickup}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: -0.3,
                  }}
                >
                  <ArrowForward
                    sx={{
                      transform: "rotate(90deg)",
                      color: "text.disabled",
                    }}
                    fontSize="small"
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.2,
                  }}
                >
                  <Flag
                    sx={{
                      color: "#D32F2F",
                      mt: 0.2,
                    }}
                    fontSize="small"
                  />

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      DESTINATION
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {destination}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Ride metadata */}
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Chip
              icon={<CalendarToday />}
              label={formatDate(
                primaryRide?.selectedDate ||
                  booking?.bookingDate
              )}
              size="small"
              variant="outlined"
            />

            {primaryRide?.selectedTime && (
              <Chip
                icon={<AccessTime />}
                label={primaryRide.selectedTime}
                size="small"
                variant="outlined"
              />
            )}

            {totalPassengers > 0 && (
              <Chip
                icon={<People />}
                label={`${totalPassengers} ${
                  totalPassengers === 1
                    ? "Passenger"
                    : "Passengers"
                }`}
                size="small"
                variant="outlined"
              />
            )}

            <Chip
              icon={<Route />}
              label={`${rides.length} ${
                rides.length === 1
                  ? "Ride"
                  : "Rides"
              }`}
              size="small"
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Payment summary */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                TOTAL AMOUNT
              </Typography>

              <Typography
                variant="h6"
                fontWeight={800}
              >
                {formatAmount(
                  booking?.amount,
                  booking?.currency
                )}
              </Typography>
            </Box>

            <Tooltip title="Payment status">
              <Chip
                icon={
                  <Payments fontSize="small" />
                }
                label={
                  booking?.payment
                    ? "Paid"
                    : "Unpaid"
                }
                color={
                  booking?.payment
                    ? "success"
                    : "warning"
                }
                size="small"
                variant={
                  booking?.payment
                    ? "filled"
                    : "outlined"
                }
              />
            </Tooltip>
          </Box>

          {/* Multiple rides */}
          {rides.length > 1 && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: "action.hover",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                This booking contains {rides.length} rides.
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* -------------------------------------------------- */}
        {/* ACTIONS */}
        {/* -------------------------------------------------- */}

        <Box
          sx={{
            p: 2.5,
            pt: 0,
          }}
        >
          <Stack spacing={1}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<DirectionsCar />}
              disabled={!inProgress}
              onClick={onTrack}
              sx={{
                borderRadius: 3,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: inProgress
                  ? "#0A4D68"
                  : "grey.300",

                color: inProgress
                  ? "#fff"
                  : "grey.600",

                "&:hover": {
                  backgroundColor:
                    inProgress
                      ? "#083B50"
                      : "grey.300",
                },
              }}
            >
              {inProgress
                ? "Track Ride"
                : "Tracking Unavailable"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              fullWidth
              disabled={!canCancel || cancelling}
              onClick={() =>
                setCancelDialogOpen(true)
              }
              sx={{
                borderRadius: 3,
                py: 1.1,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Cancel Booking
            </Button>
          </Stack>
        </Box>
      </Card>

      {/* -------------------------------------------------- */}
      {/* CANCEL CONFIRMATION */}
      {/* -------------------------------------------------- */}

      <Dialog
        open={cancelDialogOpen}
        onClose={() => {
          if (!cancelling) {
            setCancelDialogOpen(false);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          Cancel booking?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to cancel booking #
            {booking?.id}?
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() =>
              setCancelDialogOpen(false)
            }
            disabled={cancelling}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Keep Booking
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleCancel}
            disabled={cancelling}
            startIcon={
              cancelling ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <Cancel />
              )
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {cancelling
              ? "Cancelling..."
              : "Yes, Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,

    rides: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),

        pickup: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.object,
        ]),

        destination: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.object,
        ]),

        price: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),

        currency: PropTypes.string,

        description: PropTypes.string,

        selectedDate: PropTypes.string,

        selectedTime: PropTypes.string,

        passengers: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),

        imageUrl: PropTypes.string,

        type: PropTypes.string,

        status: PropTypes.string,

        driverId: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
      })
    ),

    amount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    currency: PropTypes.string,

    status: PropTypes.string,

    payment: PropTypes.bool,

    bookingDate: PropTypes.string,

    createdAt: PropTypes.string,

    updatedAt: PropTypes.string,

    paymentReference: PropTypes.string,
  }).isRequired,

  onTrack: PropTypes.func.isRequired,

  onRefresh: PropTypes.func.isRequired,
};