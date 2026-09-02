/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaShieldAlt,
  FaRoute,
  FaHeadset,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./DeliveryInfo.css";

const DeliveryInfo = () => {
  const information = [
    {
      number: "01",
      icon: FaMapMarkerAlt,
      title: "Choose your locations",
      description:
        "Enter your pickup and destination locations to find available transportation options for your journey.",
    },
    {
      number: "02",
      icon: FaRoute,
      title: "Select your ride",
      description:
        "Review the available ride options and choose the service that best fits your trip and preferences.",
    },
    {
      number: "03",
      icon: FaClock,
      title: "Track your journey",
      description:
        "Stay informed throughout your trip with real-time journey information from pickup to destination.",
    },
    {
      number: "04",
      icon: FaShieldAlt,
      title: "Arrive with confidence",
      description:
        "Travel knowing that GoOn is designed around dependable transportation and a safer, more comfortable experience.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
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
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="delivery-info" id="delivery-info">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <motion.header
        className="delivery-info__header"
        initial="hidden"
        whileInView="visible"
        variants={itemVariants}
        viewport={{
          once: true,
          amount: 0.25,
        }}
      >
        <div>
          <span className="delivery-info__eyebrow">
            HOW IT WORKS
          </span>

          <h1>
            Your journey,
            <span>made simple.</span>
          </h1>
        </div>

        <p>
          From finding a ride to reaching your destination, GoOn keeps the
          entire experience simple, connected and convenient.
        </p>
      </motion.header>

      {/* =====================================================
          PROCESS
      ====================================================== */}
      <motion.div
        className="delivery-info__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
      >
        {information.map((item) => {
          const Icon = item.icon;

          return (
            <motion.article
              className="delivery-info__card"
              key={item.number}
              variants={itemVariants}
            >
              <div className="delivery-info__card-top">
                <span className="delivery-info__number">
                  {item.number}
                </span>

                <div className="delivery-info__icon">
                  <Icon />
                </div>
              </div>

              <div className="delivery-info__card-content">
                <h2>{item.title}</h2>

                <p>{item.description}</p>
              </div>

              <span className="delivery-info__card-arrow">
                ↗
              </span>
            </motion.article>
          );
        })}
      </motion.div>

      {/* =====================================================
          INFORMATION PANEL
      ====================================================== */}
      <motion.div
        className="delivery-info__panel"
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
      >
        <div className="delivery-info__panel-content">
          <span>RIDE WITH GOON</span>

          <h2>
            Everything you need
            <br />
            for the journey.
          </h2>

          <p>
            Whether you're commuting across town, heading to an appointment
            or travelling between destinations, GoOn gives you a convenient
            way to get moving.
          </p>
        </div>

        <div className="delivery-info__panel-details">
          <div>
            <FaHeadset />

            <span>
              <strong>Support</strong>
              Available when you need assistance.
            </span>
          </div>

          <div>
            <FaShieldAlt />

            <span>
              <strong>Safety</strong>
              A journey designed with safety in mind.
            </span>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          CTA
      ====================================================== */}
      <motion.div
        className="delivery-info__cta"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        viewport={{
          once: true,
        }}
      >
        <div>
          <span>READY TO GO?</span>

          <h3>Start your journey.</h3>
        </div>

        <Link
          to="/searchRides"
          className="delivery-info__cta-button"
        >
          <span>Find a ride</span>

          <span>↗</span>
        </Link>
      </motion.div>
    </section>
  );
};

export default DeliveryInfo;