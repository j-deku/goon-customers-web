/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./ProfileDetails.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/user/userSlice";
import {
  FaUserCheck,
  FaEnvelope,
  FaUserTag,
  FaShieldAlt,
  FaCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../../../axiosInstance";

const ProfileDetails = () => {
  const user = useSelector(selectUser);

  const [verified, setVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileStatus = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/user/me", {
        withCredentials: true,
      });

      if (res.data?.success && res.data?.user) {
        setVerified(Boolean(res.data.user.verified));
      } else {
        setVerified(false);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    profileStatus();
  }, []);

  const displayName = user?.name || "GoOn User";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roles = user?.roles || [];

  return (
    <main className="profile-details">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.header
        className="profile-details__header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div>
          <span className="profile-details__eyebrow">
            ACCOUNT
          </span>

          <h1>Your Profile</h1>

          <p>
            Manage and view the information associated with your GoOn account.
          </p>
        </div>
      </motion.header>

      {/* =====================================================
          PROFILE HERO
      ====================================================== */}

      <motion.section
        className="profile-details__hero"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="profile-details__identity">
          <div className="profile-details__avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${displayName} avatar`}
              />
            ) : (
              <span>{initials}</span>
            )}

            {!loading && verified && (
              <div
                className="profile-details__verified-badge"
                title="Verified account"
              >
                <FaUserCheck />
              </div>
            )}
          </div>

          <div className="profile-details__identity-info">
            <div className="profile-details__name-row">
              <h2>{displayName}</h2>

              {!loading && verified && (
                <span className="profile-details__verified-label">
                  <FaUserCheck />
                  Verified
                </span>
              )}
            </div>

            <p>
              {user?.email || "No email address available"}
            </p>

            <span className="profile-details__member">
              GoOn Account
            </span>
          </div>
        </div>

        <div className="profile-details__status">
          <span className="profile-details__status-label">
            ACCOUNT STATUS
          </span>

          {loading ? (
            <div className="profile-details__status-value loading">
              <span className="profile-details__pulse" />
              Checking...
            </div>
          ) : verified ? (
            <div className="profile-details__status-value verified">
              <FaCircle />
              Active & Verified
            </div>
          ) : (
            <div className="profile-details__status-value unverified">
              <FaCircle />
              Verification Required
            </div>
          )}
        </div>
      </motion.section>

      {/* =====================================================
          INFORMATION
      ====================================================== */}

      <motion.section
        className="profile-details__information"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        <div className="profile-details__section-heading">
          <span>PERSONAL INFORMATION</span>
          <h2>Account Details</h2>
        </div>

        <div className="profile-details__grid">
          {/* NAME */}

          <motion.div
            className="profile-details__info-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <div className="profile-details__info-icon">
              <FaUserTag />
            </div>

            <div className="profile-details__info-content">
              <span>FULL NAME</span>
              <strong>{user?.name || "Not provided"}</strong>
            </div>
          </motion.div>

          {/* EMAIL */}

          <motion.div
            className="profile-details__info-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <div className="profile-details__info-icon">
              <FaEnvelope />
            </div>

            <div className="profile-details__info-content">
              <span>EMAIL ADDRESS</span>
              <strong>{user?.email || "Not provided"}</strong>
            </div>
          </motion.div>

          {/* SECURITY */}

          <motion.div
            className="profile-details__info-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <div className="profile-details__info-icon">
              <FaShieldAlt />
            </div>

            <div className="profile-details__info-content">
              <span>SECURITY</span>

              <strong>
                {loading
                  ? "Checking status..."
                  : verified
                  ? "Account verified"
                  : "Verification required"}
              </strong>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* =====================================================
          ROLES
      ====================================================== */}

      <motion.section
        className="profile-details__roles"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.4,
        }}
      >
        <div className="profile-details__section-heading">
          <span>ACCESS & PERMISSIONS</span>
          <h2>Your Roles</h2>
        </div>

        {roles.length > 0 ? (
          <div className="profile-details__role-list">
            {roles.map((role, index) => (
              <span
                className="profile-details__role"
                key={`${role}-${index}`}
              >
                <FaUserTag />
                {role}
              </span>
            ))}
          </div>
        ) : (
          <div className="profile-details__empty">
            No roles have been assigned to this account.
          </div>
        )}
      </motion.section>

      {/* =====================================================
          SECURITY FOOTER
      ====================================================== */}

      <motion.div
        className="profile-details__security-note"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.5,
        }}
      >
        <FaShieldAlt />

        <div>
          <strong>Your account security matters.</strong>

          <p>
            Keep your account information up to date and never share
            your login credentials with anyone.
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default ProfileDetails;