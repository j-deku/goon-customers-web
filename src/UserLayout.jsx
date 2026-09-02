import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import Home from "./Pages/Home/Home";
import PlaceBookings from "./Pages/PlaceBookings/PlaceBookings";
import Verify from "./Pages/Verify/Verify";
import NewsFeed from "./components/NewsFeed/NewsFeed";
import LoadingPage from "./components/LoadingPage/LoadingPage";
import ProfileDetails from "./components/ProfileDetails/ProfileDetails";
import PrivacyPolicy from "./components/Policy/PrivacyPolicy";
import Faq from "./components/FAQ/Faq";
import DeliveryInfo from "./components/DeliveryInfo/DeliveryInfo";
import AboutUs from "./components/AboutUs/AboutUs";
import VerifyOTP from "./components/VerifyOTP/VerifyOTP";
import Fleets from "./components/Fleets/Fleets";
import SearchInput from "./Pages/SearchInput/SearchInput";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import BookingDashboard from "./Pages/BookingDashboard/BookingDashboard";
import TrackRide from "./Pages/TrackRide/TrackRide";

import { 
  selectUser, 
  recoverSession,
  selectShouldRefreshUser,
  fetchUserInfo
} from "./features/user/userSlice";
import { loadAllAssets } from "./utils/loadImages";
import NotFound from "./Pages/NotFound/NotFound";
import MainLayout from "./components/AuthLayout/AuthLayout";
import MyBookings from "./Pages/MyBookings/MyBookings";
import NotificationSetup from "./features/NotificationSetup/NotificationSetup";
import Cart from "./Pages/Cart/Cart";
import AuthGuard from "./Guard/AuthGuard/AuthGuard";
import { Typography } from "antd";
import store from "./app/store";
import SearchAvailable from "./components/SearchAvailable/SearchAvailable";
import UserTypeForm from "./Pages/UserTypeForm/UserTypeForm";
import Bot from "./components/Bot/Bot";

export default function UserLayout() {
  const user = useSelector(selectUser);
  const [login, setLogin] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem("assetsLoaded"));
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const preload = async () => {
      try {
        if (!localStorage.getItem("assetsLoaded")) {
          console.log("Loading application assets...");
          await loadAllAssets();
          localStorage.setItem("assetsLoaded", "true");
          console.log("✅ Assets loaded successfully");
        }
        sessionStorage.setItem("assetsLoaded", "true");
      } catch (error) {
        console.warn("⚠️ Asset loading failed:", error);
      } finally {
        setInterval(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    if (isLoading) {
      preload();
    }
  }, [isLoading]);

    //  Determine onboarding immediately (before Routes render)
  useEffect(() => {
    const onboarded = localStorage.getItem("userOnboarded");
    setShowOnboarding(!onboarded);
    setReady(true);
  }, []);

useEffect(() => {
  const interval = setInterval(() => {
    if (selectShouldRefreshUser(store.getState())) {
      dispatch(recoverSession());
    }
  }, 10 * 60 * 1000);

  return () => clearInterval(interval);
}, [dispatch]);

useEffect(() => {
  dispatch(fetchUserInfo());
}, [dispatch]);

  if (isLoading || !ready) {
    return <LoadingPage />;
  }

   if (showOnboarding) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <UserTypeForm /> 
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthGuard>
        {/*<UserSocketProvider> */}
          {user && <NotificationSetup />}
          <div className="app">
            <Routes>
              <Route element={<MainLayout login={login} setLogin={setLogin} />}>
                <Route path="/" element={<Home />} />
                <Route path="/newsFeed" element={<NewsFeed />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/deliveryInfo" element={<DeliveryInfo />} />
                <Route path="/aboutUs" element={<AboutUs />} />
                <Route path="/message-us" element={<Faq />} />
                <Route path="/fleets" element={<Fleets />} />
                <Route path="/searchRides" element={<BookingDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/profile" element={<ProfileDetails />} />
                <Route path="/checkout" element={<PlaceBookings />} />
                <Route path="/myBookings" element={<MyBookings />} />
                <Route path="/track-ride/:rideId" element={<TrackRide />} />                
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<PasswordReset />} />
              </Route>
              <Route path="/verify-otp" element={<VerifyOTP setLogin={setLogin} />} />
              <Route path="/search" element={<SearchAvailable/>}/>
              <Route path="/searchInput" element={<SearchInput />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Bot />
          </div>
      {/*  </UserSocketProvider> */}
      </AuthGuard>
    </LocalizationProvider>
  );
}