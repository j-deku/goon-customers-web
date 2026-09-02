import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DriverTracking from "../../components/DriverTracking/DriverTracking";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../../axiosInstance";

const TrackRide = () => {
  const { rideId } = useParams();
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    const {data} = axiosInstance.get("/api/user/booking/bookingId", {withCredentials:true});
    const ride = data.rideId;
    setRideData(ride);
  }, [rideId]);

  return (
    <>
    <Helmet>
      <title>Track Ride - GoOn</title>
    </Helmet>
    <div>
      <h1>Tracking Ride {rideId}</h1>
      {/* Render the driver tracking component */}
      <DriverTracking rideId={rideId} rideData={rideData} />
    </div>
    </>
  );
};

export default TrackRide;
