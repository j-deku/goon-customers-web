/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Partners.css";

const Partners = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 40,
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

  const viewport = {
    once: true,
    amount: 0.2,
  };

  return (
    <section className="partners">
      {/* =========================
          SECTION HEADER
      ========================== */}
      <motion.div
        className="partners__header"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={viewport}
      >
        <span className="partners__eyebrow">GOON MOBILITY</span>

        <h2>
          Move smarter.
          <span> Arrive better.</span>
        </h2>

        <p>
          Reliable rides, intelligent technology and safety-focused service
          designed around the way you move.
        </p>
      </motion.div>

      {/* =========================
          RIDE EXPERIENCE
      ========================== */}
      <motion.section
        className="experience-card experience-card--dark"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={viewport}
      >
        <div className="experience-card__image">
          <img
            src="/Inside-car2.jpg"
            alt="Comfortable GoOn ride"
          />

          <div className="image-badge">
            <span className="image-badge__dot" />
            Available when you need it
          </div>
        </div>

        <div className="experience-card__content">
          <span className="section-number">01</span>

          <span className="mini-label">YOUR JOURNEY</span>

          <h3>
            Arrive
            <br />
            safely.
          </h3>

          <p>
            Experience comfortable, affordable and convenient transportation
            whenever you need it. Book your ride in seconds and stay connected
            from pickup to destination.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>On-demand rides</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time ride tracking</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Comfortable journeys</span>
            </div>
          </div>

          <button
            className="goon-button goon-button--light"
            type="button"
            onClick={() => navigate("/searchRides")}
          >
            <span>Book a ride</span>
            <span className="goon-button__arrow">↗</span>
          </button>
        </div>
      </motion.section>

      {/* =========================
          SMART PLATFORM
      ========================== */}
      <motion.section
        className="platform-card"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={viewport}
      >
        <img
          src="/Inside-car3.jpg"
          alt="GoOn smart mobility platform"
          className="platform-card__background"
        />

        <div className="platform-card__overlay" />

        <div className="platform-card__content">
          <span className="section-number">02</span>

          <span className="mini-label">THE GOON PLATFORM</span>

          <h3>
            Technology
            <br />
            that moves you.
          </h3>

          <p>
            GoOn connects passengers with trusted drivers through a seamless
            platform built for convenience, transparency and reliable
            transportation.
          </p>

          <div className="platform-stats">
            <div>
              <strong>01</strong>
              <span>Easy booking</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Live tracking</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Transparent pricing</span>
            </div>
          </div>

          <button
            className="goon-button goon-button--white"
            type="button"
            onClick={() => navigate("/searchRides")}
          >
            <span>Start your journey</span>
            <span className="goon-button__arrow">↗</span>
          </button>
        </div>
      </motion.section>

      {/* =========================
          TRANSFERS
      ========================== */}
      <motion.section
        className="transfers-section"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={viewport}
      >
        <div className="transfers-section__heading">
          <span className="section-number">03</span>

          <div>
            <span className="mini-label">SEAMLESS TRANSFERS</span>

            <h3>
              From here
              <br />
              to there.
            </h3>
          </div>
        </div>

        <div className="transfers-card">
          <div className="route-panel">
            <div className="route-panel__header">
              <span>YOUR ROUTE</span>
              <span className="route-status">READY</span>
            </div>

            <div className="route">
              <div className="route__point">
                <span className="route__dot route__dot--start" />

                <div>
                  <small>PICKUP</small>
                  <strong>Your location</strong>
                </div>
              </div>

              <div className="route__line">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="route__point">
                <span className="route__dot route__dot--end" />

                <div>
                  <small>DROP-OFF</small>
                  <strong>Your destination</strong>
                </div>
              </div>
            </div>

            <div className="route-panel__footer">
              <span>Professional drivers</span>
              <span>•</span>
              <span>Reliable vehicles</span>
            </div>
          </div>

          <div className="transfers-content">
            <span className="mini-label">TRANSFER SERVICE</span>

            <h4>
              Designed for
              <br />
              your schedule.
            </h4>

            <p>
              Whether you're heading across town or making an important
              connection, GoOn gives you a simple and dependable way to get
              there.
            </p>

            <div className="transfer-features">
              <div>
                <strong>01</strong>
                <span>Efficient service</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Professional drivers</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Real-time tracking</span>
              </div>
            </div>
          </div>

          <div className="transfers-image">
            <img
              src="/traveler9.jpeg"
              alt="GoOn passenger travelling"
            />
          </div>
        </div>
      </motion.section>

      {/* =========================
          SAFETY & SUPPORT
      ========================== */}
      <motion.section
        className="safety-section"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={viewport}
      >
        <div className="safety-image">
          <img
            src="/support4.jpg"
            alt="GoOn customer support"
          />

          <div className="safety-image__badge">
            <span>★★★★★</span>
            <small>Trusted support</small>
          </div>
        </div>

        <div className="safety-content">
          <span className="section-number">04</span>

          <span className="mini-label">SAFETY & SUPPORT</span>

          <h3>
            You're never
            <br />
            riding alone.
          </h3>

          <p className="safety-intro">
            Your safety is our priority. GoOn combines technology, verified
            drivers and responsive support to help make every journey more
            secure.
          </p>

          <div className="safety-grid">
            <div className="safety-item">
              <span>01</span>

              <div>
                <strong>Emergency support</strong>
                <p>Quick access to assistance when you need it.</p>
              </div>
            </div>

            <div className="safety-item">
              <span>02</span>

              <div>
                <strong>Location sharing</strong>
                <p>Share your journey with people you trust.</p>
              </div>
            </div>

            <div className="safety-item">
              <span>03</span>

              <div>
                <strong>Verified drivers</strong>
                <p>Drivers go through a screening process before driving.</p>
              </div>
            </div>

            <div className="safety-item">
              <span>04</span>

              <div>
                <strong>24/7 assistance</strong>
                <p>Our support team is available whenever you need help.</p>
              </div>
            </div>
          </div>

          <a
            href="https://apps.google.com"
            className="download-link"
            target="_blank"
            rel="noreferrer"
          >
            <span>Download the GoOn app</span>
            <span>↗</span>
          </a>
        </div>
      </motion.section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <motion.section
        className="partners-cta"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={viewport}
      >
        <span className="mini-label">READY WHEN YOU ARE</span>

        <h3>
          Your next journey
          <br />
          starts with GoOn.
        </h3>

        <button
          className="goon-button goon-button--dark"
          type="button"
          onClick={() => navigate("/searchRides")}
        >
          <span>Book your ride</span>
          <span className="goon-button__arrow">↗</span>
        </button>
      </motion.section>
    </section>
  );
};

export default Partners;