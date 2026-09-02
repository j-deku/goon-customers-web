/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from 'react';
import './NotificationCenter.css'
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Button,
  useMediaQuery,
  ListItemButton,
  Grow
} from '@mui/material';
import { MdClose, MdNotifications, MdWifiOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axiosInstance';
//import { socket } from '../../Provider/UserSocketProvider';
import { useSelector } from 'react-redux';
import { selectUserId } from '../../features/user/userSlice';

const NotificationCenter = () => {
  const userId = useSelector(selectUserId);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const audioRef = useRef(null);


      // Initialize notification sound
      useEffect(() => {
        audioRef.current = new Audio('/sounds/smooth-notify.mp3'); // Add notification sound to public folder
        audioRef.current.volume = 0.5;
      }, []);
  

  // Fetch persistent notifications from the backend
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.get(`/api/notification/user/${userId}`, {
        withCredentials: true
      });
      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      if(error.code === 'ERR_NETWORK' || error.code === 'ETIMEDOUT' || !navigator.onLine){
        toast.info("Hey🙋‍♂️, you're Offline! Please check your internet connection cables/wifi",{
          icon:<MdWifiOff size={60}/>,
          autoClose:200000,
          style:{
            backgroundColor:"darkblue",
            color:"gold",
          },
          progressStyle:{
            color:"gold",
            backgroundColor:"gold",
          },
        })
      }else if(error.code === 'ECONNRESET'){
        toast.warn("Your connection is not stable",{
          autoClose:100000,
          icon:<MdWifiOff size={60}/>,
          style:{
            color:"gold",
          },
        })
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);
/*
  useEffect(() => {
    fetchNotifications();

    socket.on("rideResponseUpdate", (data) => {
      console.log("Received rideResponseUpdate event:", data);
      if (data && data.response && data.ride && data.booking) {
                        // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
        const newNotification = {
          _id: data.notificationId || Date.now().toString(),
          message:
            data.response === "approved"
              ? `Your ride from ${data.ride.pickup} to ${data.ride.destination} has been approved.`
              : `Your ride from ${data.ride.pickup} to ${data.ride.destination} has been declined.`,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setIsOpen(true);
      }
    });

    return () => {
      socket.off("rideResponseUpdate");
    };
  }, [fetchNotifications]);
*/
  // Auto-hide notification center after 10 seconds when opened
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        setIsOpen(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Mark individual notification as read
  const markNotificationRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    try {
      await axiosInstance.post(
        `/api/notification/mark-read`,
        { notificationId },
        { withCredentials: true }
      );
    } catch (error) {
      //
    }
  };

  // Delete a single notification
  const clearNotification = async (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    try {
      await axiosInstance.post(
        `/api/notification/delete`,
        { notificationId },
        { withCredentials: true }
      );
    } catch (error) {
      //
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    try {
      await axiosInstance.post(
        `/api/notification/mark-all-read`,
        { userId },
        { withCredentials: true }
      );
    } catch (error) {
      // silent fail
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    setNotifications([]);
    try {
      await axiosInstance.delete(`/api/notification/clear-all/${userId}`, {
        withCredentials: true
      });
    } catch (error) {
      //
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className='notification-center'>
      {/* Toggle Button with Badge */}
      <IconButton
        sx={{
          position: 'fixed',
          top: 60,
          right: 20,
          zIndex: 1400,
          bgcolor: 'background.paper',
          boxShadow: 2,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <MdClose size={28} />
        ) : (
          <Badge badgeContent={unreadCount} color="error">
            <MdNotifications size={28} />
          </Badge>
        )}
      </IconButton>

      {/* Notification Center Container with Animation */}
      <Grow in={isOpen} timeout={{ enter: 500, exit: 500 }}>
        <Box
          sx={{
            position: isMobile ? 'fixed' : 'fixed',
            top: isMobile ? 'auto' : 90,
            bottom: isMobile ? 0 : 'auto',
            right: isMobile ? 0 : 20,
            width: { xs: '100%', sm: 340 },
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Notifications
            </Typography>
            <Button variant="outlined" size="small" onClick={markAllAsRead} sx={{ fontSize:12, p: 0.5 }}>
              Mark All Read
            </Button>
            <IconButton onClick={clearAllNotifications} aria-label="clear all">
              <Typography>Clear All</Typography>
            </IconButton>
          </Box>
          <Divider />
          {loading ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading notifications...
            </Typography>
          ) : notifications.length === 0 ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No notifications available.
            </Typography>
          ) : (
            <List>
              {notifications.map((notif) => (
                <ListItemButton
                  key={notif._id}
                  onClick={() => markNotificationRead(notif._id)}
                  sx={{
                    backgroundColor: notif.isRead ? 'inherit' : 'rgba(0, 0, 0, 0.05)',
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={notif.message}
                    secondary={new Date(notif.createdAt).toLocaleString()}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => clearNotification(notif._id)}
                      aria-label="dismiss"
                    >
                      <MdClose />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
              ))}
            </List>
          )}
          <Button fullWidth variant="outlined" onClick={fetchNotifications} sx={{ mt: 2 }}>
            Refresh
          </Button>
        </Box>
      </Grow>
    </div>
  );
};

export default NotificationCenter;