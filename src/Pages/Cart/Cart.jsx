import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, selectCartItems } from "../../features/cart/cartSlice";
import "./Cart.css";
import { Helmet } from "react-helmet-async";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);

  const handleRemoveRide = (rideId) => {
    dispatch(removeFromCart(rideId));
  };

  // Subtotal = sum of (price × requestedSeats)
  const subtotal = cartItems.reduce(
    (sum, r) => sum + Number(r.price) * Number(r.requestedSeats || 1),
    0
  );
  const serviceFee = subtotal ? 2 : 0;
  const total = subtotal + serviceFee;
  const currency = cartItems[0]?.currency || "GHS";

  const printPage = () => window.print();

  return (
    <>
      <Helmet>
        <title>Cart – TOLI‑TOLI</title>
      </Helmet>

      <div className="cart">
        <div className="cart-item">
          <div className="cart-title">
            <p>Route</p>
            <p>Date</p>
            <p>Qty</p>
            <p>Price</p>
            <p>Remove</p>
            <p>
              <img
                onClick={printPage}
                src="/printer (2).png"
                alt="print"
                style={{ cursor: "pointer" }}
              />
            </p>
          </div>
          <hr />

          {cartItems.length > 0 ? (
            cartItems.map((ride) => (
              <React.Fragment key={ride._id}>
                <div className="cart-title cart-items-item">
                  <p>{ride.pickup} → {ride.destination}</p>
                  <p>
                    {ride.selectedDate
                      ? new Date(ride.selectedDate).toLocaleDateString()
                      : "--"}
                  </p>
                  <p>{ride.requestedSeats || 1}</p>
                  <p>
                    {currency}{" "}
                    {(
                      Number(ride.price) * Number(ride.requestedSeats || 1)
                    ).toFixed(2)}
                  </p>
                  <p>
                    <img
                      onClick={() => handleRemoveRide(ride.id)}
                      className="delete"
                      src="/trash.png"
                      alt="remove"
                      style={{ cursor: "pointer" }}
                    />
                  </p>
                </div>
                <hr />
              </React.Fragment>
            ))
          ) : (
            <p>No rides selected.</p>
          )}
        </div>

        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>
                {currency} {subtotal.toFixed(2)}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Service Fee</p>
              <p>
                {currency} {serviceFee.toFixed(2)}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>
                {currency} {total.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              disabled={cartItems.length === 0}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
