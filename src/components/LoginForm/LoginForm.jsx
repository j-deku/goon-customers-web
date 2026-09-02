import { useState, useRef, useEffect } from "react";
import "./LoginForm.css";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Howl } from "howler";
import PropTypes from "prop-types";
import axiosInstance from "../../../axiosInstance";
import { useDispatch } from "react-redux";
import { fetchUserInfo, clearError } from "../../features/user/userSlice";
import { syncFcmToken } from "../../shared/firebase/syncFcmToken";

const LoginForm = ({ setLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const successTone = useRef(
    new Howl({ src: ["/sounds/apple-sms.mp3"], volume: 1 })
  ).current;

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
    setLoginError(null);
    
    return () => {
      isMounted.current = false;
    };
  }, [dispatch]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Min 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
        "Weak password"
      )
      .required("Required"),
  });

  const handleError = (err) => {
    let errorMessage = "Something went wrong. Please try again.";
    
    if (!err.response) {
      // Network error
      if (!navigator.onLine) {
        errorMessage = "You are offline. Please check your internet connection.";
      } else {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      setLoginError(errorMessage);
      toast.warn(errorMessage);
      return;
    }

    const { status, data } = err.response;
    const message = data?.message || data?.error || "An error occurred";
    
    switch (status) {
      case 400:
        errorMessage = message || "Invalid login credentials.";
        break;
      case 401:
        errorMessage = message || "Invalid email or password.";
        break;
      case 403:
        errorMessage = message || "Your acount is not yet verified.";
        navigate("/verify-otp");
        setLogin(false);
        break;
      case 423:
        errorMessage = message || "Account is temporarily locked. Please try again later.";
        break;
      case 404:
        errorMessage = message || "No account found with this email.";
        break;
      case 429:
        errorMessage = "Too many login attempts. Please wait and try again.";
        break;
      case 500:
      case 502:
      case 503:
        errorMessage = "Server is temporarily unavailable. Please try again later.";
        break;
      default:
        errorMessage = message || "Login failed. Please try again.";
    }
    
    setLoginError(errorMessage);
    toast.error(errorMessage);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    // Clear previous errors
    setLoginError(null);
    dispatch(clearError());

    try {
      const { data } = await axiosInstance.post(
        "/api/user/login",
        values,
        { withCredentials: true }
      );

      if (data.userId) {
        localStorage.setItem("userId", data.userId);
      }

      // Success feedback
      successTone.play();
      toast.success(data.message || "Login successful!");
      
      // Close login modal
      setLogin(false);
      // After successTone.play() and toast.success()
      await dispatch(fetchUserInfo()).unwrap();
      setLogin(false);
      navigate("/");
      // Navigate to home
      navigate("/");

      setTimeout(() => {
        syncFcmToken().catch((error) => {
          console.warn("FCM token sync failed:", error);
        });
      }, 2000); // Increased delay

    } catch (err) {
      console.error("Login error:", err);
      
      // Handle specific validation errors
      if (err.response?.status === 400 && err.response?.data?.field) {
        const { field, message } = err.response.data;
        setFieldError(field, message);
        return;
      }
      
      handleError(err);
    } finally {
      if (isMounted.current) {
        setSubmitting(false);
      }
    }
  };

  const resetPassPage = () =>{
    navigate("/forgot-password", "_blank")
    setLogin(false);
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
      <Typography variant="h5" align="center" color="gray" mb={3}>
        Login to Your Account
      </Typography>

      {/* Error Alert */}
      {loginError && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setLoginError(null)}
        >
          {loginError}
        </Alert>
      )}

      {/* Offline Warning */}
      {!navigator.onLine && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are currently offline. Please check your internet connection.
        </Alert>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form noValidate>
            <Field
              as={TextField}
              name="email"
              label="Email"
              placeholder="Enter your email address"
              fullWidth
              required
              margin="normal"
              error={touched.email && !!errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaEnvelope />
                  </InputAdornment>
                ),
              }}
            />
            <ErrorMessage
              name="email"
              component="div"
              style={{ color: "red", fontSize: "0.5rem" }}
            />

            <Field
              as={TextField}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              error={touched.password && !!errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <ErrorMessage
              name="password"
              component="div"
              style={{ color: "red", fontSize: "0.875rem" }}
            />
            <Typography
              variant="body2"
              align="right"
              sx={{ mt: 1, mb: 2, cursor: "pointer", color: "blue" }}
              onClick={resetPassPage}
            >
              Forgot Password?
            </Typography>

            <Box textAlign="center" my={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !navigator.onLine}
                fullWidth
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : null
                }
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Box>

            <Typography align="center" variant="body2">
              OR
            </Typography>

            <Box textAlign="center" mt={2}>
              <Button
                variant="outlined"
                fullWidth
                disabled={!navigator.onLine}
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`)
                }
              >
                Continue with Google
              </Button>
            </Box>
            
            {!navigator.onLine && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                align="center" 
                display="block" 
                mt={1}
              >
                Login is disabled while offline
              </Typography>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

LoginForm.propTypes = {
  setLogin: PropTypes.func.isRequired,
};

export default LoginForm;