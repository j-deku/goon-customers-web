import React, { useEffect, useState } from "react";
import "./PlaceBookings.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectIsAuthenticated, selectUser } from "../../features/user/userSlice";
import { selectCartItems } from "../../features/cart/cartSlice";
import { Helmet } from "react-helmet-async";
import { Button, CircularProgress, Typography } from "@mui/material";
import axiosInstance from "../../../axiosInstance";

const PlaceBookings = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector(selectCartItems);
  const user = useSelector(selectUser);
  const [selectedRides, setSelectedRides] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // Keep selectedRides in sync with cart
  useEffect(() => {
    if (cartItems.length) setSelectedRides(cartItems);
    else setSelectedRides(JSON.parse(localStorage.getItem("selectedRides")) || []);
  }, [cartItems]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Compute subtotal (price * requestedSeats), service fee, and total
  const subtotal = selectedRides.reduce(
    (sum, r) => sum + Number(r.price) * Number(r.requestedSeats || 1),
    0
  );
  const serviceFee = subtotal ? 2 : 0;
  const total = subtotal + serviceFee;
  const currency = selectedRides[0]?.currency || "GHS";

  const placeBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("You must be logged in to place your booking");
      return;
    }
    if (!selectedRides.length) {
      toast.error("Your cart is empty");
      return;
    }

    // Only send {_id, passengers} to server
    const ridesPayload = selectedRides.map((r) => ({
      id: r.id,
      passengers: r.requestedSeats || 1,
    }));

    try {
      setPlacing(true);
      const resp = await axiosInstance.post(
        "/api/user/booking/place",
        {
          userId: user?.id,
          address: data,
          rides: ridesPayload,
          amount: total,
          currency,
          email: data.email,
        },
        { withCredentials: true }
      );
      if (resp.data.success && resp.data.authorization_url) {
        window.location.replace(resp.data.authorization_url);
      } else {
        toast.error(resp.data.message || "Error placing booking");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Booking failed");
    }finally {
      setPlacing(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Place Booking - GoOn</title>
    </Helmet>
    <form onSubmit={placeBooking} className="placeOrder">
      <div className="placeOrder-left">
        <p className="title">Booking Information</p>
        <div className="multi-fields">
          <input type="text" name="firstName" onChange={onChangeHandler} value={data.firstName} placeholder="First Name" required />
          <input type="text" name="lastName" onChange={onChangeHandler} value={data.lastName} placeholder="Last Name" required />
        </div>
        <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="Email Address" required />
        <input type="text" name="street" onChange={onChangeHandler} value={data.street} placeholder="Street Name" required />
        <div className="multi-fields">
          <input type="text" name="city" onChange={onChangeHandler} value={data.city} placeholder="City" required />
          <input type="text" name="state" onChange={onChangeHandler} value={data.state} placeholder="State" required />
        </div>
        <div className="multi-fields">
          <input type="text" name="zipCode" onChange={onChangeHandler} value={data.zipCode} placeholder="Zip Code" required />
          <input type="text" name="country" onChange={onChangeHandler} value={data.country} placeholder="Country" required />
        </div>
        <input type="tel" name="phone" onChange={onChangeHandler} value={data.phone} placeholder="Phone +233..." required />
      </div>

      <div className="placeOrder-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>{currency} {subtotal.toFixed(2)}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Service Fee</p>
            <p>{currency} {serviceFee.toFixed(2)}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <p>{currency} {total.toFixed(2)}</p>
          </div>
          <Button type="submit" disabled={selectedRides.length === 0 || placing} variant="contained" color="primary" fullWidth>
            {placing ? <Typography>Placing Booking...
              <CircularProgress size={20} title="Placing Booking..."/>
            </Typography>: "PROCEED TO PAYMENT"}
          </Button>
        </div>
      </div>
    </form>
     </>
  );
};

export default PlaceBookings;