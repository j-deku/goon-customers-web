import "./Footer.css";
import { Link, Navigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import facebookIcon from "@iconify/icons-simple-icons/facebook";
import messengerIcon from "@iconify/icons-simple-icons/messenger";
import whatsappIcon from "@iconify/icons-simple-icons/whatsapp";
import linkedinIcon from "@iconify/icons-simple-icons/linkedin";
import twitterIcon from "@iconify/icons-simple-icons/x";
import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectUserRoles,
} from "../../features/user/userSlice";
import { useSelector } from "react-redux";

const Footer = () => {
  const AUTH = import.meta.env.VITE_AD_AUTH;
  const AUTH_LINK_TEXT = import.meta.env.VITE_AUTH_LINK_TEXT;
  const AUTH_LK = import.meta.env.VITE_AUTH_LINK1;

  const DR_AUTH = import.meta.env.VITE_DR_AUTH;
  const DR_LK = import.meta.env.VITE_AUTH_LINK_DR;
  const DR_AUTH_LINK_TEXT = import.meta.env.VITE_AUTH_LINK_TEXT_DR;

  function AuthGuard({ allowedRoles = [], children }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const roles = useSelector(selectUserRoles);
    const authChecked = useSelector(selectAuthStatus);

    if (!authChecked) {
      return "";
    }

    if (!isAuthenticated) {
      return "";
    }

    if (
      allowedRoles.length > 0 &&
      !roles.some((role) => allowedRoles.includes(role))
    ) {
      return "";
    }

    return <>{children}</>;
  }

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <Link to="/">
            <div className="logo">
              <em>GoOn</em>
            </div>
          </Link>{" "}
          <p>
            <b>GoOn – Book. Travel. Relax.</b>
            <br />
            Seamless ride booking with secure payments and instant
            confirmations. Travel made easy!
          </p>
          <div className="footer-social-icons">
            <Link to="https://facebook.com" target="_blank">
              <Icon icon={facebookIcon} color="whitesmoke" width="30" />
            </Link>
            <Link to="https://facebook.com" target="_blank">
              <Icon icon={messengerIcon} color="whitesmoke" width="30" />
            </Link>
            <Link to="https://wa.me/+233544684595/" target="_blank">
              <Icon icon={whatsappIcon} color="whitesmoke" width="30" />
            </Link>
            <Link to="https://linkedin/jdeku-jdek" target="_blank">
              <Icon icon={linkedinIcon} color="whitesmoke" width="30" />
            </Link>
            <Link to="https://twitter.com/jdeku-jdek" target="_blank">
              <Icon icon={twitterIcon} color="whitesmoke" width="30" />
            </Link>
          </div>
        </div>
        <hr className="stroke" />
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/aboutUs">About Us</Link>
            </li>
            <li>
              <Link to="/deliveryInfo">Delivery</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy</Link>
            </li>
            <li>
              <Link to="/message-us">Frequently Asked Questions</Link>
            </li>
            <li>
              <Link to="/fleets">Our Fleets</Link>
            </li>
            <li>
              <Link to="/partners">Partners or Affiliations</Link>
            </li>
          </ul>
        </div>
        <hr className="stroke" />
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>
              <a href="tel:+233-246-062-758">🔗 +233-246-062-758</a>
            </li>
            <li>
              <a href="mailto:jdeku573@gmail.com">🔗 jdeku573@gmail.com</a>
            </li>
            <li>
              <a href="sms:+233246062758">🔗Chat via SMS</a>
            </li>
            <li>
              <AuthGuard allowedRoles={AUTH}>
                <Link to={`${AUTH_LK}/login`}>{AUTH_LINK_TEXT}</Link>
              </AuthGuard>
            </li>
             <li>
              <AuthGuard allowedRoles={DR_AUTH}>
                <Link to={`${DR_LK}/login`}>{DR_AUTH_LINK_TEXT}</Link>
              </AuthGuard>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        &copy; Inc. {new Date().getFullYear()} GoOn. All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
