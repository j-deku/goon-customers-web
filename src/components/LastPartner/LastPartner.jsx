/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaMobileAlt, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./LastPartner.css";

const LastPartner = () => {
  const navigate = useNavigate();

  return (
    <section className="last-partner">

      <motion.div
        className="last-partner__visual"
        initial={{
          opacity: 0,
          scale: 0.97,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
      >

        <img
          src="/Inside-car.jpg"
          alt="Passenger enjoying a GoOn ride"
          className="last-partner__image"
        />

        <div className="last-partner__overlay" />

        <div className="last-partner__top-label">
          <span className="last-partner__dot" />
          MOVE WITH GOON
        </div>


        <motion.div
          className="last-partner__content"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          <div className="last-partner__icon">
            <FaMobileAlt />
          </div>

          <span className="last-partner__eyebrow">
            THE GOON EXPERIENCE
          </span>

          <h2>
            Your journey.
            <br />
            <em>Our commitment.</em>
          </h2>

          <p>
            GoOn brings safe, reliable, and convenient transportation
            together in one seamless experience. Wherever you're going,
            we're here to help you get there with confidence.
          </p>

          <div className="last-partner__features">

            <div>
              <FaShieldAlt />
              <span>
                <strong>Safety focused</strong>
                Trusted transportation experience
              </span>
            </div>

            <div>
              <FaMobileAlt />
              <span>
                <strong>Simple booking</strong>
                Your ride, just a few taps away
              </span>
            </div>

          </div>

          <div className="last-partner__actions">

            <button
              type="button"
              onClick={() => navigate("/search")}
              className="last-partner__primary"
            >
              Book a Ride
              <FaArrowRight />
            </button>

            <a
              href="https://apps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="last-partner__secondary"
            >
              Get the App
            </a>

          </div>

        </motion.div>


        <div className="last-partner__bottom">
          <span>GOON</span>
          <span>MOVE WITH CONFIDENCE</span>
        </div>

      </motion.div>

    </section>
  );
};

export default LastPartner;