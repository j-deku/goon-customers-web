import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { FaCheck, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";

const RegisForm = ({ setLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(5, "Enter your full name").required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
        "Must include uppercase, lowercase, number, and special character."
      )
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/api/user/register`, values, {
        withCredentials: true,
      });

      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);

        toast.success("OTP sent to your email!");
        setShowSuccessScreen(true);

        // Redirect to verify page after delay
        setTimeout(() => {
          navigate(response.data.redirect);
        }, 5000);
        setTimeout(() => {
          setLogin(false);
        }, 6000);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data?.message || "User already exists");
      } else if (error.response && error.response.status === 401) {
        toast.error(error.response.data?.message || "Invalid email format");
      } else if (error.response && error.response.status === 403) {
        toast.warn(
          error.response.data?.message ||
            "Password must include uppercase, lowercase, and a special character."
        );
      } else if (error.response && error.response.status === 500) {
        toast.error(
          error.response.data?.message || "Server down. Please try again later."
        );
      } else if (error.code === "ERR_NETWORK") {
        toast.warn("Network unstable. Check your internet connection");
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen component
  if (showSuccessScreen) {
    return (
      <Card sx={{ textAlign: "center", p: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Registration Successful <FaCheck color="green" size={20}/>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We’ve sent a one-time password (OTP) to your email.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check your inbox or spam folder to verify your account.
          </Typography>
          <CircularProgress sx={{ mt: 3 }} size={28} />
        </CardContent>
      </Card>
    );
  }

  //  Default registration form
  return (
    <div>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center", color: "gray" }}>
        Register
      </Typography>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                name="name"
                label="Full Name"
                required
                fullWidth
                value={values.name}
                onChange={(e) => {
                  const capitalizedValue = e.target.value.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  );
                  handleChange({
                    target: { name: e.target.name, value: capitalizedValue },
                  });
                }}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser style={{ marginRight: "8px" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                name="email"
                label="Email"
                type="email"
                required
                fullWidth
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope style={{ marginRight: "8px" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ marginRight: "8px" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePassword} tabIndex={-1}>
                        {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

RegisForm.propTypes = {
  setLogin: PropTypes.func.isRequired,
};

export default RegisForm;
