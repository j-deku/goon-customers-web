import { useEffect } from "react";
import Header from "../../components/Header/Header";
import DesignDisplay from "../../components/DesignDisplay/DesignDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { toast } from "react-toastify";
import Bot from "../../components/Bot/Bot";
import Fleets from "../../components/Fleets/Fleets";
import Partners from "../../components/Partners/Partners";
import NotificationCenter from "../../components/NotificationCenter/NotificationCenter";
import { Helmet } from "react-helmet-async";
import RideLandingContent from "../../components/RideLandingContent/RideLandingContent";
import ScrollBottomButton from "../../components/ScrollBottomButton/ScrollBottomButton";
const Home = () => {

  useEffect(() => {
    const handleVerified = (event) => {
      if (event.data?.verified) {
        toast.success("User Verified Successfully. Redirecting ...");

        window.location.href = "/";
      }
    };
    window.addEventListener("message", handleVerified, false);
    return () => window.removeEventListener("message", handleVerified, false);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Book Your Rides - GoOn</title>
        <meta name="description" content="GoOn is a ride-hailing platform that connects drivers and passengers for convenient transportation services." />
        <meta name="keywords" content="GoOn, ride-hailing platform, transportation, drivers, passengers, Accra, Kumasi, booking, rides, transport" />
        <meta name="author" content="GoOn Team" />
        <link rel="canonical" href="https://goon.com/rides/accra-to-kumasi" />
      </Helmet>
      <NotificationCenter/>
      <Header />
      <RideLandingContent/>
      <DesignDisplay />
      <Partners/>
      <Fleets/>
      <AppDownload />
    </div>
  );
};

export default Home;