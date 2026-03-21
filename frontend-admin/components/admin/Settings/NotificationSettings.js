import React, { useEffect, useState } from "react";
import { Box, FormControlLabel, Switch, Typography, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings, updateSiteSettings } from "@/redux/siteSettingsSlice";
import { toast } from "react-toastify";

const NotificationsSettings = () => {
  const dispatch = useDispatch();
  const { siteSettings, isLoading, successMessage, error } = useSelector(state => state.settings);
  const [notifications, setNotifications] = useState({
    newUserRegistered: true,
    newVendorRegistered: true,
    newOrderPlaced: true,
    refundRequested: true,
    productReviewSubmitted: true,
  });

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (siteSettings?.notifications) {
      setNotifications(siteSettings.notifications);
    }
  }, [siteSettings]);

  const handleToggle = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    console.log("🔍 Sending notification data to update:", {
        ...siteSettings,
        notifications,
      });
      
    const result = await dispatch(updateSiteSettings({ notifications }));
    if (result.type.includes("fulfilled")) {
      toast.success("Notification settings updated");
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>Notification Preferences</Typography>

      {isLoading ? <CircularProgress /> : (
        <>
          {Object.entries(notifications).map(([key, value]) => (
            <FormControlLabel
              key={key}
              control={
                <Switch
                  checked={value}
                  onChange={() => handleToggle(key)}
                />
              }
              label={key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              sx={{ display: 'block', my: 1 }}
            />
          ))}

          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
            Save Preferences
          </Button>
        </>
      )}
    </Box>
  );
};

export default NotificationsSettings;
