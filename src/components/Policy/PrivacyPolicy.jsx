/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaCookieBite,
  FaLock,
  FaUserShield,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./PrivacyPolicy.css";

const Privacy_Policy = () => {
  const sections = [
    {
      id: "01",
      title: "Information We Collect",
      content: (
        <>
          <p>
            When you use GoOn, we may collect information needed to provide
            and improve our transportation services.
          </p>

          <ul>
            <li>Account and profile information</li>
            <li>Contact information</li>
            <li>Pickup and destination information</li>
            <li>Booking and ride details</li>
            <li>Device and technical information</li>
            <li>Information you provide when contacting support</li>
          </ul>
        </>
      ),
    },
    {
      id: "02",
      title: "How We Use Your Information",
      content: (
        <>
          <p>
            We use collected information to operate GoOn and provide a
            reliable transportation experience.
          </p>

          <ul>
            <li>Process and manage ride bookings</li>
            <li>Connect passengers with available drivers</li>
            <li>Provide ride and account notifications</li>
            <li>Improve our platform and services</li>
            <li>Maintain platform security</li>
            <li>Provide customer support</li>
          </ul>
        </>
      ),
    },
    {
      id: "03",
      title: "Location Information",
      content: (
        <p>
          GoOn may use location information when necessary to provide
          transportation services, including helping determine pickup
          locations, destinations, routes, and other ride-related features.
          Location access may depend on the permissions you provide through
          your device.
        </p>
      ),
    },
    {
      id: "04",
      title: "Cookies & Similar Technologies",
      content: (
        <>
          <p>
            We may use cookies and similar technologies to help our website
            function correctly, remember preferences, understand how our
            services are used, and improve the overall user experience.
          </p>

          <p>
            You can manage cookie preferences through your browser settings.
            Disabling certain cookies may affect some features of the
            platform.
          </p>
        </>
      ),
    },
    {
      id: "05",
      title: "Information Security",
      content: (
        <p>
          We take reasonable technical and organizational measures to protect
          information against unauthorized access, loss, misuse, alteration,
          or disclosure. However, no internet-based service can guarantee
          absolute security.
        </p>
      ),
    },
    {
      id: "06",
      title: "Information Sharing",
      content: (
        <p>
          GoOn may share information when necessary to provide our services,
          operate the platform, comply with applicable laws, protect users,
          prevent fraud, or respond to legitimate legal requests. We do not
          sell personal information simply because you use our platform.
        </p>
      ),
    },
    {
      id: "07",
      title: "Your Choices & Rights",
      content: (
        <p>
          Depending on applicable law, you may have rights regarding your
          personal information, including requesting access, correction,
          deletion, or information about how your data is used. You may also
          manage certain communication and device permissions through your
          account or device settings.
        </p>
      ),
    },
    {
      id: "08",
      title: "Changes to This Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time as our services,
          technology, or legal requirements change. When significant changes
          are made, we will take reasonable steps to make the updated policy
          available to users.
        </p>
      ),
    },
  ];

  return (
    <main className="privacy-policy">
      {/* =====================================================
          HERO
      ====================================================== */}

      <motion.header
        className="privacy-policy__hero"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="privacy-policy__hero-icon">
          <FaShieldAlt />
        </div>

        <span className="privacy-policy__eyebrow">
          GOON · PRIVACY
        </span>

        <h1>
          Your privacy
          <span>matters to us.</span>
        </h1>

        <p>
          We believe your personal information should be handled with care,
          transparency, and respect. This policy explains how GoOn collects,
          uses, and protects information when you use our services.
        </p>

        <div className="privacy-policy__updated">
          <span>LAST UPDATED</span>
          <strong>August 27, 2026</strong>
        </div>
      </motion.header>

      {/* =====================================================
          TRUST CARDS
      ====================================================== */}

      <motion.div
        className="privacy-policy__trust"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        <motion.div
          className="privacy-policy__trust-card"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <FaLock />

          <div>
            <strong>Protected</strong>
            <span>We take reasonable steps to protect your information.</span>
          </div>
        </motion.div>

        <motion.div
          className="privacy-policy__trust-card"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <FaUserShield />

          <div>
            <strong>Responsible</strong>
            <span>Your information is used to operate and improve GoOn.</span>
          </div>
        </motion.div>

        <motion.div
          className="privacy-policy__trust-card"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <FaCookieBite />

          <div>
            <strong>Transparent</strong>
            <span>We explain how cookies and similar technologies work.</span>
          </div>
        </motion.div>
      </motion.div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="privacy-policy__layout">
        <aside className="privacy-policy__navigation">
          <span>ON THIS PAGE</span>

          <nav>
            {sections.map((section) => (
              <a href={`#privacy-${section.id}`} key={section.id}>
                <small>{section.id}</small>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <motion.div
          className="privacy-policy__content"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {sections.map((section) => (
            <motion.section
              className="privacy-policy__section"
              id={`privacy-${section.id}`}
              key={section.id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              <div className="privacy-policy__section-number">
                {section.id}
              </div>

              <div className="privacy-policy__section-body">
                <h2>{section.title}</h2>

                {section.content}
              </div>
            </motion.section>
          ))}

          {/* =================================================
              CONTACT
          ================================================== */}

          <section className="privacy-policy__contact">
            <div className="privacy-policy__contact-icon">
              <FaShieldAlt />
            </div>

            <div>
              <span>PRIVACY QUESTIONS?</span>

              <h2>
                We're here to help.
              </h2>

              <p>
                If you have questions or concerns about this Privacy Policy
                or how GoOn handles your information, please contact our
                support team.
              </p>

              <Link to="/contact">
                Contact GoOn Support
                <span>↗</span>
              </Link>
            </div>
          </section>
        </motion.div>
      </div>

      {/* =====================================================
          FOOTER NOTE
      ====================================================== */}

      <div className="privacy-policy__footer">
        <span>GOON</span>

        <p>
          Safe journeys. Better connections. Respect for your privacy.
        </p>
      </div>
    </main>
  );
};

export default Privacy_Policy;