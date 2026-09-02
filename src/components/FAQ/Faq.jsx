/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import "./Faq.css";

const faqItems = [
  {
    question: "What is GoOn?",
    answer:
      "GoOn is a ride-hailing and transportation platform that connects passengers with trusted drivers. You can use GoOn to search for rides, book trips and enjoy convenient transportation.",
  },
  {
    question: "How do I book a ride?",
    answer:
      "Simply choose your pickup and destination locations, review the available ride options and continue with your preferred booking. GoOn is designed to make the process quick and straightforward.",
  },
  {
    question: "How do I know how much my ride will cost?",
    answer:
      "Your ride information and applicable fare are presented during the booking process, helping you understand the cost before confirming your trip.",
  },
  {
    question: "Are GoOn drivers verified?",
    answer:
      "GoOn is built around trusted transportation and driver safety. Drivers are subject to the platform's verification and screening requirements before providing rides.",
  },
  {
    question: "Can I track my ride?",
    answer:
      "Yes. GoOn is designed to provide real-time trip information so you can stay informed about your journey from pickup through to your destination.",
  },
  {
    question: "What should I do if I have a problem during my trip?",
    answer:
      "If you experience an issue, use the available support options within the GoOn platform. Our support team is available to help with trip-related questions and concerns.",
  },
  {
    question: "Can I use GoOn for transfers?",
    answer:
      "Yes. GoOn can support convenient transfers for passengers who need dependable transportation between locations.",
  },
  {
    question: "How can I become a GoOn driver?",
    answer:
      "Drivers can apply through the GoOn driver platform. The onboarding process includes providing the required information and completing the applicable verification steps.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="faq" id="faq">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <motion.div
        className="faq__header"
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
          amount: 0.25,
        }}
      >
        <div>
          <span className="faq__eyebrow">
            NEED TO KNOW
          </span>

          <h1>
            Frequently asked
            <span>questions.</span>
          </h1>
        </div>

        <p>
          Everything you need to know about booking rides, travelling with
          GoOn and getting support when you need it.
        </p>
      </motion.div>

      {/* =====================================================
          FAQ LIST
      ====================================================== */}
      <motion.div
        className="faq__list"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
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
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              className={`faq__item ${isOpen ? "is-open" : ""}`}
              key={item.question}
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
              <button
                type="button"
                className="faq__question"
                onClick={() => toggleFaq(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="faq__question-left">
                  <span className="faq__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="faq__question-text">
                    {item.question}
                  </span>
                </div>

                <span className="faq__toggle">
                  {isOpen ? <FaArrowUp /> : <FaArrowDown />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    className="faq__answer-wrapper"
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="faq__answer">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* =====================================================
          SUPPORT CTA
      ====================================================== */}
      <motion.div
        className="faq__support"
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
        <div className="faq__support-content">
          <span>STILL HAVE QUESTIONS?</span>

          <h2>
            We're here
            <br />
            to help.
          </h2>

          <p>
            Can't find what you're looking for? Our support team is ready
            to assist you.
          </p>
        </div>

        <a
          href="#contact"
          className="faq__support-button"
        >
          <span>Contact support</span>

          <span className="faq__support-arrow">
            ↗
          </span>
        </a>
      </motion.div>

      {/* =====================================================
          BACK TO TOP
      ====================================================== */}
      <motion.a
        href="#first"
        className="back-to-top"
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={{
          once: true,
        }}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </motion.a>
    </section>
  );
};

export default Faq;