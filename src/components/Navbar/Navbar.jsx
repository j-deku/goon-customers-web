import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import ToggleTheme from "../ToggleTheme/ToggleTheme"; // Assuming this is a custom component
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, selectCartItems } from "../../features/cart/cartSlice";
import { persistStore } from "redux-persist";
import store from "../../app/store";
import { clearUser, fetchUserInfo, logoutUser, selectUser } from "../../features/user/userSlice";
import './Navbar.css';

// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArchiveIcon from "@mui/icons-material/Archive";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import LanguageModal from "../LanguageModal/LanguageModal";
import ReactCountryFlag from "react-country-flag";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 0,
  });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const Navbar = ({ setLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState();

const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
useEffect(() => {
  if (isAuthenticated && !user) {
    dispatch(fetchUserInfo());
  }
}, [isAuthenticated, user, dispatch]);

  useEffect(() => {
 const handleScroll = () => setIsScrolled(window.scrollY > 20);

window.addEventListener("scroll", handleScroll);

return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const logout = async () => {
    await dispatch(logoutUser());
    dispatch(clearUser());
    dispatch(clearCart());
    persistStore(store).purge();
    navigate("/");
    handleCloseUserMenu();
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearchInput = () => {
    navigate("/searchInput");
    if (drawerOpen) setDrawerOpen(false); // Close drawer if open
  };

  const languageCountryMap = {
    en: "US", es: "ES", fr: "FR", de: "DE", it: "IT", pt: "PT", zh: "CN",
    ja: "JP", ru: "RU", ar: "SA", hi: "IN", ko: "KR", nl: "NL", sv: "SE", tr: "TR",
  };
  const currentCountryCode = languageCountryMap[i18n.language] || "US";

  // Navigation items for both main menu and drawer
  const navItems = [
    { label: t("navbar.home"), path: "/" },
    { label: t("navbar.menu"), href: "#design-display" },
    { label: t("navbar.mobileApp"), href: "#app-download" },
    { label: t("navbar.contactUs"), href: "#footer" },
  ];

  // User dropdown menu items
  const userMenuItems = [
    { label: t("navbar.profile"), icon: <PersonIcon />, action: () => navigate("/profile") },
    { label: t("navbar.notifications"), icon: <NotificationsIcon />, action: () => navigate("/newsFeed") },
    { label: t("navbar.bookings"), icon: <ArchiveIcon />, action: () => navigate("/myBookings") },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", width: "100%" }}>
      <IconButton onClick={handleDrawerToggle} sx={{ p: 2, float: 'right' }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" sx={{ my: 2, fontStyle: "italic", letterSpacing:-3}} className="logo">
        GoOn
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{pr:5}}>
            <ListItemButton
              component={item.path ? Link : "a"}
              to={item.path}
              href={item.href}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.label.toUpperCase()} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {/* Mobile-only icons moved to drawer */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleSearchInput}>
            <ListItemIcon><SearchIcon /></ListItemIcon>
            <ListItemText primary={t("navbar.search") || "Search"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setLanguageModalOpen(true)}>
            <ListItemIcon>
              <ReactCountryFlag
                countryCode={currentCountryCode}
                svg
                style={{ width: "1em", height: "1em", borderRadius: "50%" }}
                title={i18n.language.toUpperCase()}
              />
            </ListItemIcon>
            <ListItemText primary={t("navbar.language") || "Language"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon sx={{ml:1}}>
          <ToggleTheme />
          </ListItemIcon>
            <Typography variant="body2" sx={{ mr: 1 }}>{t("navbar.changeTheme") || "Change Theme:"}</Typography>
            
        </ListItem>
        <Divider />

        {!user ? (
          <ListItem disablePadding>
            <ListItemButton
              sx={{ textAlign: "center", borderRadius:20 }}
              onClick={() => {
                setLogin(true);
                handleDrawerToggle();
              }}
            >
              <ListItemText primary={t("navbar.signIn")} />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile")}>
                <ListItemIcon>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name[0]} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: "cover" }} />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={user?.name || t("navbar.welcome")} />
              </ListItemButton>
            </ListItem>
            {userMenuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => { item.action(); handleDrawerToggle(); }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary={t("navbar.logout")} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar className={`navbar ${isScrolled ? "scroll-active" : "scroll-inactive"}`} id="navbar"  position="sticky" sx={{ background: "linear-gradient(135deg, black, #504e4eff)", boxShadow: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: "bold", fontStyle: "italic", mr: 2, letterSpacing: -3 }}>
                GoOn
              </Typography>
            </Link>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={item.path ? Link : "a"}
                to={item.path}
                href={item.href}
                sx={{ mx: 1, textTransform: "none", fontSize: "1rem" }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Section Icons & Buttons - Optimized for Mobile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}> {/* Reduced gap for xs */}

            {/* Cart Icon - Always visible, high priority */}
            <Link to="/cart" style={{ color: "inherit" }}>
              <IconButton color="inherit">
                <Badge badgeContent={cartCount} color="error">
                  {cartCount > 0 ? (
                    <ShoppingBagIcon sx={{ fontSize: "1.7rem" }} />
                  ) : (
                    <ShoppingCartIcon sx={{ fontSize: "1.7rem" }} />
                  )}
                </Badge>
              </IconButton>
            </Link>

            {/* Search Icon - Visible on desktop, hidden on mobile (moved to drawer) */}
            <IconButton color="inherit" onClick={handleSearchInput} sx={{ display: { xs: "none", md: "block" } }}>
              <SearchIcon sx={{ fontSize: "1.7rem" }} />
            </IconButton>

            {/* Toggle Theme - Visible on desktop, hidden on mobile (moved to drawer) */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <ToggleTheme />
            </Box>

            <IconButton onClick={() => setLanguageModalOpen(true)} color="inherit" sx={{ p: 0, display: { xs: "none", md: "block" } }}>
              <ReactCountryFlag
                countryCode={currentCountryCode}
                svg
                style={{ width: "1.5em", height: "1.5em", borderRadius: "50%", border: '1px solid rgba(255,255,255,0.5)' }}
                title={i18n.language.toUpperCase()}
              />
            </IconButton>
            <LanguageModal open={languageModalOpen} onClose={() => setLanguageModalOpen(false)} />

            {!user ? (
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => setLogin(true)}
                sx={{ ml: { xs: 1, sm: 2, borderRadius:20 }, borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }, display: { xs: 'none', md: 'block' } }} // Hide Sign In button on mobile
              >
                {t("navbar.signIn")}
              </Button>
            ) : (
              <Box sx={{ ml: { xs: 1, sm: 2 }, display: { xs: 'none', md: 'block' } }}> {/* Hide user profile button on mobile */}
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name[0]} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <AccountCircleIcon sx={{ fontSize: 40, color: "white" }} />
                  )}
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userMenuItems.map((item) => (
                    <MenuItem key={item.label} onClick={() => { item.action(); handleCloseUserMenu(); }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <Typography textAlign="center">{item.label}</Typography>
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem onClick={logout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <Typography textAlign="center">{t("navbar.logout")}</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}

            {/* Hamburger Icon for Mobile - Only visible on mobile */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: { xs: 0, sm: 1 }, display: { md: "none" } }} // Adjust margin for mobile
            >
              <MenuIcon sx={{ fontSize: "1.7rem" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 300,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  setLogin: PropTypes.func.isRequired,
};

export default Navbar;