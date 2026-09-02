/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Paper,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const slides = [
  { id: 1, question: "Are you a passenger or a driver?", type: "choice" },
  { id: 2, question: "What's your name?", type: "text", field: "name" },
  { id: 3, question: "Enter your email", type: "text", field: "email" },
];

const UserTypeForm = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({ role: "", name: "", email: "" });
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const totalSteps = slides.length;
  const slide = slides[step];

  // Intro fade timing
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  const handleNext = () => {
    if (step === totalSteps - 1) {
      localStorage.setItem("userOnboarded", "true");
      localStorage.setItem("userRole", formData.role);
      if (formData.role === "driver") {
        navigate("/driver/register");
      } else {
        window.location.href = "/";
      }
    } else {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [slide.field]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #f5f9ff, #ffffff)",
        px: 2,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ✅ Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            marginBottom: "1.5rem",
            background: "linear-gradient(90deg, black, gray, black)",
            padding: "0.75rem",
            borderRadius: "8px",
          }}
        >
          <img
            src="/GN-logo.png"
            alt="GoOn Logo"
            style={{
              width: "70px",
              height: "70px",
              marginBottom: "0.5rem",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#007bff",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            GoOn
          </Typography>
        </motion.div>

        {/* ✅ Intro Message Animation */}
        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              style={{
                height: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 1, fontWeight: 600, color: "#333" }}
              >
                Welcome to GoOn 🚀
              </Typography>
              <Typography variant="body1" sx={{ color: "gray" }}>
                Let’s get you started in just a few quick steps.
              </Typography>
            </motion.div>
          ) : (
            <>
              {/* Stepper */}
              <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
                {slides.map((s) => (
                  <Step key={s.id}>
                    <StepLabel />
                  </Step>
                ))}
              </Stepper>

              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={((step + 1) / totalSteps) * 100}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  mb: 3,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Animated Slide Content */}
              <Box sx={{ position: "relative", height: 200 }}>
                <AnimatePresence custom={direction}>
                  <motion.div
                    key={slide.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                      position: "absolute",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, fontWeight: 600, color: "#333" }}
                    >
                      {slide.question}
                    </Typography>

                    {slide.type === "choice" ? (
                      <Box display="flex" gap={2} justifyContent="center">
                        <Button
                          variant={
                            formData.role === "passenger"
                              ? "contained"
                              : "outlined"
                          }
                          color="primary"
                          onClick={() => handleRoleSelect("passenger")}
                        >
                          Passenger
                        </Button>
                        <Button
                          variant={
                            formData.role === "driver"
                              ? "contained"
                              : "outlined"
                          }
                          color="secondary"
                          onClick={() => handleRoleSelect("driver")}
                        >
                          Driver
                        </Button>
                      </Box>
                    ) : (
                      <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                          variant="outlined"
                          label={
                            slide.field === "email"
                              ? "Email Address"
                              : "Full Name"
                          }
                          type={slide.field === "email" ? "email" : "text"}
                          value={formData[slide.field] || ""}
                          onChange={handleChange}
                          fullWidth
                        />
                        <Box display="flex" justifyContent="space-between">
                          <Button
                            variant="outlined"
                            disabled={step === 0}
                            onClick={handleBack}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!formData[slide.field]}
                          >
                            {step === totalSteps - 1 ? "Finish" : "Next"}
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Box>

              <Typography
                variant="caption"
                sx={{ mt: 4, display: "block", color: "gray" }}
              >
                Step {step + 1} of {totalSteps}
              </Typography>
            </>
          )}
        </AnimatePresence>
      </Paper>
    </Box>
  );
};

export default UserTypeForm;
