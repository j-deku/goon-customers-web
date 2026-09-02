import { useState, useRef, useEffect, useCallback } from "react";
import "./VerifyOTP.css";
import { Box, Button, Typography, CircularProgress, Link } from "@mui/material";
import { Howl } from "howler";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosInstance";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const VerifyOTP = () => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const successTone = useRef(
    new Howl({ src: ["/apple-toast.mp3"], volume: 1, loop: false })
  );

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-focus first box on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const handleChange = (index, value) => {
    // Only allow single digits
    const clean = value.replace(/\D/g, "").slice(-1);
    setError("");

    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    if (clean && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Clear current box first
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        focusInput(index - 1);
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);

    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    focusInput(lastFilled);
  };

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  const handleSubmit = useCallback(async () => {
    if (!isComplete || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        "/api/user/verify-otp",
        { otp: code },
        { withCredentials: true }
      );

      if (response.data.success) {
        successTone.current.play();
        toast.success("OTP verified successfully!");
        window.location.href = response.data.redirect;
      } else {
        setError(response.data.message || "Invalid code. Please try again.");
        setDigits(Array(OTP_LENGTH).fill(""));
        focusInput(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP.");
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, isComplete, isSubmitting]);

  // Auto-submit once all 6 digits are filled
  useEffect(() => {
    if (isComplete) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const handleResendOTP = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);

    try {
      const response = await axiosInstance.post(
        "/api/user/resend-otp",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("A new code has been sent.");
        setDigits(Array(OTP_LENGTH).fill(""));
        setError("");
        focusInput(0);
        setCooldown(RESEND_COOLDOWN);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box className="verify-otp-page">
      <div className="whitePaper" />

      <div className="verify-otp">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "rgb(4, 44, 59)", mb: 1 }}>
            Verify your email
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Enter the 6-digit code we sent to your email address.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 1, sm: 1.5 },
            mb: 2,
          }}
          onPaste={handlePaste}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              value={digit}
              aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
              disabled={isSubmitting}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className={`otp-box ${error ? "otp-box-error" : ""}`}
            />
          ))}
        </Box>

        {error && (
          <Typography
            variant="body2"
            role="alert"
            sx={{ color: "error.main", textAlign: "center", mb: 2, minHeight: 20 }}
          >
            {error}
          </Typography>
        )}

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            disabled={!isComplete || isSubmitting}
            sx={{
              padding: "12px",
              mb: 2,
              backgroundColor: "rgb(4, 44, 59)",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "rgb(3, 34, 46)" },
            }}
          >
            {isSubmitting ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Verify code"}
          </Button>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Didn't get the code?{" "}
            {cooldown > 0 ? (
              <span>Resend available in {cooldown}s</span>
            ) : (
              <Link
                component="button"
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                underline="hover"
                sx={{ fontWeight: 600, cursor: "pointer", color:"rgb(20, 46, 85)" }}
              >
                {isResending ? "Sending..." : "Resend code"}
              </Link>
            )}
          </Typography>
        </Box>
      </div>
    </Box>
  );
};

export default VerifyOTP;