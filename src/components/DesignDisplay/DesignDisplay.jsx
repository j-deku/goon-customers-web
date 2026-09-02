/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  FaCalendar,
  FaCoins,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";
import "./DesignDisplay.css";

const DesignDisplay = () => {
  const benefits = [
    {
      number: "01",
      icon: FaCoins,
      title: "Affordable fares",
      description:
        "Enjoy competitive pricing without compromising on comfort, service quality or reliability.",
    },
    {
      number: "02",
      icon: FaCalendar,
      title: "Effortless convenience",
      description:
        "Book your journey easily, manage your trip and enjoy a seamless transportation experience.",
    },
    {
      number: "03",
      icon: FaShieldAlt,
      title: "Built around safety",
      description:
        "Travel with confidence through trusted drivers, reliable vehicles and safety-focused technology.",
    },
    {
      number: "04",
      icon: FaHeadset,
      title: "Always here to help",
      description:
        "Our support team is available around the clock to help with bookings, questions and unexpected issues.",
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
      y: 35,
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
    <section className="design-display" id="design-display">
      {/* =========================
          HEADER
      ========================== */}
      <motion.header
        className="design-display__header"
        initial="hidden"
        whileInView="visible"
        variants={itemVariants}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="design-display__heading">
          <span className="design-display__eyebrow">
            THE GOON DIFFERENCE
          </span>

          <h1>
            Why ride
            <span>with GoOn?</span>
          </h1>
        </div>

        <p>
          More than getting from A to B. GoOn brings together affordability,
          convenience, safety and dependable support to create a better way to
          move.
        </p>
      </motion.header>

      {/* =========================
          BENEFITS
      ========================== */}
      <motion.div
        className="design-display-list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
      >
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <motion.article
              className="benefit-card"
              variants={itemVariants}
              key={benefit.number}
            >
              <div className="benefit-card__top">
                <span className="benefit-card__number">
                  {benefit.number}
                </span>

                <div className="benefit-card__icon">
                  <Icon />
                </div>
              </div>

              <div className="benefit-card__body">
                <h2>{benefit.title}</h2>

                <p>{benefit.description}</p>
              </div>

              <div className="benefit-card__line" />
            </motion.article>
          );
        })}
      </motion.div>

      {/* =========================
          BRAND STATEMENT
      ========================== */}
      <motion.div
        className="design-display__statement"
        initial={{
          opacity: 0,
          y: 30,
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
          amount: 0.3,
        }}
      >
        <span>GOON</span>

        <p>
          Simple journeys.
          <br />
          Better experiences.
        </p>

        <div className="design-display__statement-mark">
          ↗
        </div>
      </motion.div>
    </section>
  );
};

export default DesignDisplay;