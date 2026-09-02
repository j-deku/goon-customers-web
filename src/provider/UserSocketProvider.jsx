/* eslint-disable no-unused-vars */
// UserSocketProvider.jsx
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
//import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  logoutUser,
  selectIsAuthenticated,
  selectUserId,
} from "../features/user/userSlice";
/*
const socket = io(import.meta.env.VITE_API_BASE_URL, {
 // path: "/socket.io",
  //transports: ["websocket", "polling"],
  //reconnection:true,
  //reconnectionAttempts: 5,
  //reconnectionDelay: 500,
  withCredentials: true,
});
*/
const UserSocketProvider = ({ children }) => {
 /* 
  const dispatch = useDispatch();
const userId = useSelector(selectUserId) || localStorage.getItem("userId");  
const isAuthenticated = useSelector(selectIsAuthenticated);
const audioRef = useRef(null);

  // Prevent duplicate joins
  const hasJoined = useRef(false);
    // Initialize notification sound
    useEffect(() => {
      audioRef.current = new Audio('/smooth-notify.mp3'); // Add notification sound to public folder
      audioRef.current.volume = 0.5;
    }, []);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    // Join the user’s private room
    if (!hasJoined.current) {
      socket.emit("joinUserRoom", userId);
      hasJoined.current = true;
      console.log(`User ${userId} joined room.`);
    }

    const handlers = {
      rideResponseUpdate: (data) => {
        if (data.response === "approved") {
          toast.success("Your ride has been approved!");
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
        } else {
          toast.error("Your ride has been declined.");
        }
      },
      bookingApproved: () => {
        toast.success("Your ride has been approved!");
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      },
      bookingDeclined: () => {
        toast.error("Your ride has been declined.");
      },
      rideStarted: () => {
        toast.info("Your driver is on the way!");
      },
      updateDriverLocation: ({ lat, lng }) => {
        // no toast; map component handles marker updates
        console.log(`Driver location update: ${lat}, ${lng}`);
      },
      rideCompleted: ({ fare }) => {
        toast.success(`Ride complete! Fare: $${fare.toFixed(2)}`);
      },
    };
 
    // Wire up handlers
    Object.entries(handlers).forEach(([event, fn]) => {
      socket.on(event, fn);
    });

    // Connection error handling
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      //toast.error("Realtime connection lost. Please refresh.");
    });

    return () => {
      // Leave room
      socket.emit("leaveUserRoom", userId);

      // Remove handlers
      Object.keys(handlers).forEach((event) => {
        socket.off(event);
      });
      socket.off("connect_error");

      // Optionally disconnect entirely on logout:
      if (!isAuthenticated) {
        socket.disconnect();
        hasJoined.current = false;
        dispatch(logoutUser());
      }
    };
  }, [isAuthenticated, userId, dispatch]);

  return <>{children}</>;
  */
};

UserSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

//export { socket };
export default UserSocketProvider;
