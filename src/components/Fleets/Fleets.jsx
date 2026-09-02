/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Fleets.css";

const Fleets = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeLeft = {
    hidden: {
      opacity: 0,
      x: -40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeRight = {
    hidden: {
      opacity: 0,
      x: 40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <main className="fleets">
      {/* =========================
          HEADER
      ========================== */}
      <motion.header
        className="fleets__header"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="fleets__eyebrow">GOON FLEET</span>

        <h1>
          Choose your
          <span>perfect ride.</span>
        </h1>

        <p>
          Comfortable, dependable vehicles designed to make every GoOn journey
          feel effortless.
        </p>
      </motion.header>

      {/* =========================
          FEATURED VEHICLE
      ========================== */}
      <motion.section
        className="fleet-showcase"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Image */}
        <motion.div
          className="fleet-showcase__image"
          variants={fadeLeft}
        >
          <img
            src="/taxi.jpg"
            alt="GoOn vehicle"
          />

          <div className="fleet-showcase__image-overlay" />

          <div className="fleet-image-label">
            <span className="fleet-image-label__dot" />
            Available for booking
          </div>

          <div className="fleet-image-number">
            01
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="fleet-showcase__content"
          variants={fadeRight}
        >
          <span className="fleet-category">
            GOON STANDARD
          </span>

          <h2>
            Compact.
            <br />
            Comfortable.
            <br />
            Ready.
          </h2>

          <p className="fleet-description">
            Our versatile fleet is designed for everyday journeys, short trips
            and comfortable city transportation. Whether you're travelling
            alone or with a small group, you can expect a smooth and dependable
            ride.
          </p>

          {/* Features */}
          <div className="fleet-features">
            <div className="fleet-feature">
              <span className="fleet-feature__number">01</span>

              <div>
                <strong>Comfortable seating</strong>
                <p>
                  Spacious interiors designed for a relaxed journey.
                </p>
              </div>
            </div>

            <div className="fleet-feature">
              <span className="fleet-feature__number">02</span>

              <div>
                <strong>Everyday versatility</strong>
                <p>
                  Ideal for city rides, short trips and daily commutes.
                </p>
              </div>
            </div>

            <div className="fleet-feature">
              <span className="fleet-feature__number">03</span>

              <div>
                <strong>Professional service</strong>
                <p>
                  Matched with trusted GoOn drivers for your journey.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            className="fleet-button"
            type="button"
            onClick={() => navigate("/searchRides")}
          >
            <span>Book this ride</span>

            <span className="fleet-button__arrow">
              ↗
            </span>
          </button>
        </motion.div>
      </motion.section>

      {/* =========================
          BOTTOM INFORMATION
      ========================== */}
      <motion.section
        className="fleet-info"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="fleet-info__item">
          <span>01</span>

          <div>
            <strong>Reliable</strong>
            <p>
              Dependable transportation whenever you need it.
            </p>
          </div>
        </div>

        <div className="fleet-info__item">
          <span>02</span>

          <div>
            <strong>Comfortable</strong>
            <p>
              Designed around a smooth and enjoyable ride.
            </p>
          </div>
        </div>

        <div className="fleet-info__item">
          <span>03</span>

          <div>
            <strong>Convenient</strong>
            <p>
              Book your journey quickly through GoOn.
            </p>
          </div>
        </div>
      </motion.section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <motion.section
        className="fleet-cta"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={{ once: true, amount: 0.3 }}
      >
        <span>READY TO GO?</span>

        <h3>
          Your ride is
          <br />
          waiting.
        </h3>

        <button
          type="button"
          onClick={() => navigate("/searchRides")}
        >
          Book a ride
          <span>↗</span>
        </button>
      </motion.section>
    </main>
  );
};

export default Fleets;