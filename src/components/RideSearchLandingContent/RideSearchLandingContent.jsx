/* eslint-disable */
import { Box, Button, Typography, CircularProgress, useTheme, Fade, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";

export default function RideSearchLandingContent() {
  const theme = useTheme();
  const navigate = useNavigate();

  const openSearchModal = () => {
    navigate("/search");
  }

    const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.25, 0.8, 0.25, 1] },
    },
  };
  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.4 },
    },
  };
  
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{once:false}}
      variants={staggerContainer}
    >
      <Box
      className="landing-description"
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          placeSelf:"center",
          mt: { xs: -6, sm: '120px' },
          height: '100%',
          width: '95%',
          maxWidth: '800px',
          textAlign: 'center',
          bgcolor: { xs: 'whitesmoke', sm: 'transparent' },
          padding:4,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            mb: 2,
            fontSize: { xs: '2rem', sm: '3rem' },
            fontWeight: 800,
            color: '#333',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Welcome to GoOn
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: { xs: 2, sm:4 },
            color: 'text.secondary',
            maxWidth: '600px',
            fontSize:18,
            lineHeight: { xs: 1.2, sm: 1.5 },
            textAlign: {xs:'center', sm:'center'},
            fontFamily: '"Poppins", Arial, sans-serif',
            placeSelf: {xs:'center', sm:'center'},
            p: {xs: 1, sm:1},
          }}
        >
          Experience fast, reliable, and comfortable transport services.
          Search and book your ride seamlessly with GoOn.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={openSearchModal}
          sx={{
            width: { xs: '100%', sm: '300px' },
            py: { xs: 1, sm: 2 },
            px: { xs: 1.5, sm: 3 },
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: "0 0 16px #4280b9ff",
              bgcolor:"#444"
            },
            background:"linear-gradient(90deg, black, gray)",
          }}
        >   
          Search for a Ride
        </Button>
        <Divider className="description-divider" sx={{bgcolor: {xs:'#ddd', sm:'none'}, width:"100%", mt:8}}/>
      </Box>
      </motion.div>
  );
}
 