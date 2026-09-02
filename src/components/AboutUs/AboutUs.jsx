import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaRoute,
  FaShieldAlt,
  FaUsers,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css";

const AboutUs = () => {
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

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <main className="about-us">

      {/* =====================================================
          HERO
      ====================================================== */}

      <motion.section
        className="about-us__hero"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className="about-us__hero-content">

          <motion.div
            className="about-us__eyebrow"
            variants={fadeUp}
          >
            <span />
            ABOUT GOON
          </motion.div>

          <motion.h1 variants={fadeUp}>
            Moving people.
            <span>Connecting life.</span>
          </motion.h1>

          <motion.p variants={fadeUp}>
            GoOn is built to make everyday transportation simpler,
            safer, and more accessible. We connect passengers with
            trusted drivers through a seamless digital experience
            designed around the way people move.
          </motion.p>

          <motion.div
            className="about-us__hero-actions"
            variants={fadeUp}
          >
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="about-us__primary-button"
            >
              Find a Ride
              <FaArrowRight />
            </button>

            <span className="about-us__hero-note">
              Simple booking · Reliable journeys
            </span>
          </motion.div>

        </div>

        <motion.div
          className="about-us__hero-visual"
          variants={fadeUp}
        >
          <img
            src="/Inside-car3.jpg"
            alt="Passenger travelling with GoOn"
          />

          <div className="about-us__floating-card">
            <span>GOON</span>
            <strong>Built for the journey.</strong>
          </div>

          <div className="about-us__hero-number">
            <span>01</span>
            <small>OUR STORY</small>
          </div>
        </motion.div>
      </motion.section>


      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <motion.section
        className="about-us__intro"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={stagger}
      >
        <motion.div
          className="about-us__intro-label"
          variants={fadeUp}
        >
          <span>01</span>
          WHO WE ARE
        </motion.div>

        <motion.div
          className="about-us__intro-content"
          variants={fadeUp}
        >
          <h2>
            Transportation should feel
            <em> effortless.</em>
          </h2>

          <p>
            Getting from one place to another should not be complicated.
            GoOn was created around a simple idea: make transportation
            easier for everyone.
          </p>

          <p>
            From finding a ride to reaching your destination, we bring
            technology, convenience, and human connection together in
            one platform.
          </p>
        </motion.div>
      </motion.section>


      {/* =====================================================
          VALUES
      ====================================================== */}

      <section className="about-us__values">

        <motion.div
          className="about-us__values-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.span variants={fadeUp}>
            WHAT DRIVES US
          </motion.span>

          <motion.h2 variants={fadeUp}>
            More than a ride.
          </motion.h2>

          <motion.p variants={fadeUp}>
            Every part of GoOn is designed around creating a better
            transportation experience.
          </motion.p>
        </motion.div>


        <motion.div
          className="about-us__value-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={stagger}
        >

          <motion.article
            className="about-us__value-card"
            variants={fadeUp}
          >
            <div className="about-us__value-icon">
              <FaShieldAlt />
            </div>

            <span>01</span>

            <h3>Safety First</h3>

            <p>
              We put safety at the heart of the experience,
              from trusted drivers to reliable transportation.
            </p>
          </motion.article>


          <motion.article
            className="about-us__value-card"
            variants={fadeUp}
          >
            <div className="about-us__value-icon">
              <FaBolt />
            </div>

            <span>02</span>

            <h3>Simple & Fast</h3>

            <p>
              Find, book, and manage your journey through an
              experience designed to keep things simple.
            </p>
          </motion.article>


          <motion.article
            className="about-us__value-card"
            variants={fadeUp}
          >
            <div className="about-us__value-icon">
              <FaUsers />
            </div>

            <span>03</span>

            <h3>People First</h3>

            <p>
              We build technology around real people and the
              everyday journeys that matter to them.
            </p>
          </motion.article>


          <motion.article
            className="about-us__value-card"
            variants={fadeUp}
          >
            <div className="about-us__value-icon">
              <FaRoute />
            </div>

            <span>04</span>

            <h3>Always Moving</h3>

            <p>
              We continuously improve our platform so your
              journeys become better with every trip.
            </p>
          </motion.article>

        </motion.div>
      </section>


      {/* =====================================================
          MISSION
      ====================================================== */}

      <motion.section
        className="about-us__mission"
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >

        <div className="about-us__mission-image">
          <img
            src="/traveler9.jpeg"
            alt="GoOn transportation journey"
          />
        </div>

        <div className="about-us__mission-content">

          <span>OUR MISSION</span>

          <h2>
            Making every
            <strong> journey count.</strong>
          </h2>

          <p>
            Our mission is to build a transportation platform people
            can trust. One that gives passengers convenient access to
            rides while creating opportunities for drivers.
          </p>

          <p>
            We believe better transportation can create better
            connections between people, places, businesses, and
            communities.
          </p>

          <div className="about-us__mission-line" />

          <small>
            GOON · MOVE WITH CONFIDENCE
          </small>

        </div>

      </motion.section>


      {/* =====================================================
          STATS
      ====================================================== */}

      <motion.section
        className="about-us__stats"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={stagger}
      >

        <motion.div
          className="about-us__stat"
          variants={fadeUp}
        >
          <strong>24/7</strong>
          <span>Support</span>
        </motion.div>

        <motion.div
          className="about-us__stat"
          variants={fadeUp}
        >
          <strong>1</strong>
          <span>Connected Platform</span>
        </motion.div>

        <motion.div
          className="about-us__stat"
          variants={fadeUp}
        >
          <strong>∞</strong>
          <span>Possibilities</span>
        </motion.div>

      </motion.section>


      {/* =====================================================
          CTA
      ====================================================== */}

      <motion.section
        className="about-us__cta"
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
      >

        <div>
          <span>READY TO MOVE?</span>

          <h2>
            Your next journey
            <em> starts here.</em>
          </h2>

          <p>
            Discover a simpler way to get where you're going.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/search")}
        >
          Book a Ride
          <FaArrowRight />
        </button>

      </motion.section>

    </main>
  );
};

export default AboutUs;