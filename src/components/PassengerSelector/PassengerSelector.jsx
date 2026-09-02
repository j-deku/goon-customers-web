import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function PassengerSelector({ value, setValue, min = 1, max = 6 }) {
  const [animateKey, setAnimateKey] = useState(0);

  // Trigger animation when value changes
  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [value]);

  const handleDecrease = () => {
    if (value > min) setValue(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) setValue(value + 1);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        border: "1px solid #ddd",
        borderRadius: "50px",
        padding: "6px 12px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.12)" },
        width: 140,
      }}
    >
      {/* Decrease Button */}
      <IconButton
        size="small"
        onClick={handleDecrease}
        disabled={value <= min}
        sx={{ color: value > min ? "#2C3E50" : "#ccc" }}
      >
        <Remove />
      </IconButton>

      {/* Animated Number */}
      <AnimatePresence mode="wait">
        <motion.div
          key={animateKey}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Typography variant="h6" sx={{ minWidth: 30, textAlign: "center" }}>
            {value}
          </Typography>
        </motion.div>
      </AnimatePresence>

      {/* Increase Button */}
      <IconButton
        size="small"
        onClick={handleIncrease}
        disabled={value >= max}
        sx={{ color: value < max ? "#2C3E50" : "#ccc" }}
      >
        <Add />
      </IconButton>
    </Box>
  );
}
