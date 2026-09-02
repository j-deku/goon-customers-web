import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Lazy loaded layouts
const AdminLayout = () =>{

};
const DriverLayout = () =>{


};

import {
  recoverSession,
  restoreUserState,
} from "./features/user/userSlice";
import { useDispatch } from "react-redux";
import UserLayout from "./UserLayout";


export default function App() {
  const dispatch = useDispatch();
  // Service Worker Sound Notifications
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "PLAY_SOUND") {
          const audio = new Audio("/sounds/apple-toast.mp3");
          audio
            .play()
            .catch((err) => console.warn("Audio playback blocked:", err));
        }
      });
    }
  }, []);

  useEffect(() => {
  dispatch(restoreUserState());
  dispatch(recoverSession());
}, [dispatch]);

  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Routes>
        {/* User routes */}
        <Route path="/*" element={<UserLayout />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LocalizationProvider>
  );
}
