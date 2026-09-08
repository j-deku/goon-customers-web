/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { MdRefresh, MdDeleteSweep, MdCheckCircle, MdNotifications } from "react-icons/md";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUserId } from "../../features/user/userSlice";
//import { socket } from "../../Provider/UserSocketProvider";
import "./NewsFeed.css";
import axiosInstance from "../../../axiosInstance";

const NewsFeed = () => {
  const userId = useSelector(selectUserId);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  // Sound setup
  useEffect(() => {
    audioRef.current = new Audio("/sounds/smooth-notify.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/user/notifications`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark all read
const markAllRead = async () => {
  try {
    await axiosInstance.post(
      "/api/user/notification/mark-all-read",
      {},
      {
        withCredentials: true,
      }
    );

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    toast.success("All notifications marked as read.");
  } catch (error) {
    toast.error("Failed to mark notifications as read.");
    fetchNotifications();
  }
};

  // Clear all
const clearAll = async () => {
  try {
    await axiosInstance.delete(
      "/api/user/notification/clear-all",
      {
        withCredentials: true,
      }
    );

    setNotifications([]);

    toast.success("All notifications cleared.");
  } catch (error) {
    toast.error("Failed to clear notifications.");
    fetchNotifications();
  }
};



const markNotificationAsRead = async (notificationId) => {
  try {
    await axiosInstance.patch(
      `/api/user/notifications/${notificationId}/read`,
      {},
      {
        withCredentials: true,
      }
    );

    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationId ||
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  } catch (error) {
    toast.error("Failed to update notification.");
  }
};

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box className="newsFeed">
      <Box className="newsFeedHeader">
        <Box display="flex" alignItems="center" gap={1}>
          <MdNotifications size={28} color="#1976d2" />
          <Typography variant="h5" fontWeight="bold">
            Notification Center
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchNotifications}>
              <MdRefresh size={22} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark All Read">
            <IconButton onClick={markAllRead}>
              <MdCheckCircle size={22} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear All">
            <IconButton onClick={clearAll}>
              <MdDeleteSweep size={22} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary" mt={4}>
          No notifications yet. 🎉
        </Typography>
      ) : (
        <Box className="feedContainer">
          {notifications.map((notif, index) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                  variant="outlined"
                  onClick={() => {
                    if (!notif.isRead) {
                      markNotificationAsRead(notif.id || notif._id);
                    }
                  }}
                  className={`feedCard ${notif.isRead ? "read" : "unread"}`}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {notif.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    {new Date(notif.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      {unreadCount > 0 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={markAllRead}
            startIcon={<MdCheckCircle />}
          >
            Mark all as read ({unreadCount})
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NewsFeed;
