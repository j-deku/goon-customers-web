/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./RideLandingContent.css";

export default function RideLandingContent() {
  const navigate = useNavigate();

  const openSearchModal = () => {
    navigate("/search");
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
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

  return (
    <section className="ride-landing-content">
      <motion.div
        className="ride-landing-content__inner"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.25,
        }}
      >
        {/* Eyebrow */}
        <motion.div
          className="ride-landing-content__eyebrow"
          variants={itemVariants}
        >
          <span className="ride-landing-content__line" />
          <span>GOON MOBILITY</span>
          <span className="ride-landing-content__line" />
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={itemVariants}>
          Your journey.
          <span>Our priority.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="ride-landing-content__description"
          variants={itemVariants}
        >
          Fast, reliable and comfortable transportation designed around the
          way you move. Find a ride, book your journey and get there with
          GoOn.
        </motion.p>

        {/* CTA */}
        <motion.button
          className="ride-landing-content__button"
          type="button"
          onClick={openSearchModal}
          variants={itemVariants}
        >
          <span>Search for a ride</span>

          <span className="ride-landing-content__button-arrow">
            ↗
          </span>
        </motion.button>

        {/* Trust indicators */}
        <motion.div
          className="ride-landing-content__trust"
          variants={itemVariants}
        >
          <div className="ride-trust-item">
            <span className="ride-trust-item__icon">✓</span>

            <div>
              <strong>Reliable</strong>
              <small>When you need us</small>
            </div>
          </div>

          <div className="ride-trust-divider" />

          <div className="ride-trust-item">
            <span className="ride-trust-item__icon">✓</span>

            <div>
              <strong>Transparent</strong>
              <small>Clear pricing</small>
            </div>
          </div>

          <div className="ride-trust-divider" />

          <div className="ride-trust-item">
            <span className="ride-trust-item__icon">✓</span>

            <div>
              <strong>Connected</strong>
              <small>Track your journey</small>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="ride-landing-content__scroll"
          variants={itemVariants}
        >
          <span>EXPLORE GOON</span>

          <div className="ride-landing-content__scroll-line" />

          <span className="ride-landing-content__scroll-arrow">
            ↓
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}