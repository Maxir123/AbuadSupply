import React, { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings, updateSiteSettings } from "@/redux/siteSettingsSlice";
import { toast } from "react-toastify";

// Helper to format label and add descriptions
const notificationConfig = {
  newUserRegistered: {
    label: "New User Registration",
    description: "Get notified when a new customer signs up",
  },
  newVendorRegistered: {
    label: "New Vendor Registration",
    description: "Get notified when a new vendor joins the platform",
  },
  newOrderPlaced: {
    label: "New Order Placed",
    description: "Receive alerts for every new order",
  },
  refundRequested: {
    label: "Refund Requested",
    description: "Notify when a customer requests a refund",
  },
  productReviewSubmitted: {
    label: "Product Review Submitted",
    description: "Get notified when a product receives a new review",
  },
};

const NotificationsSettings = () => {
  const dispatch = useDispatch();
  const { siteSettings, isLoading, successMessage, error } = useSelector((state) => state.settings);
  const [notifications, setNotifications] = useState({
    newUserRegistered: true,
    newVendorRegistered: true,
    newOrderPlaced: true,
    refundRequested: true,
    productReviewSubmitted: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (siteSettings?.notifications) {
      setNotifications(siteSettings.notifications);
    }
  }, [siteSettings]);

  const handleToggle = (field) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await dispatch(updateSiteSettings({ notifications }));
      if (result.type.includes("fulfilled")) {
        toast.success("Notification settings updated");
      } else {
        toast.error(result.payload || "Update failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.100",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose which events you want to be notified about
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {Object.entries(notifications).map(([key, value]) => {
          const config = notificationConfig[key] || {
            label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
            description: "",
          };
          return (
            <Grid item xs={12} sm={6} key={key}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={() => handleToggle(key)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        {config.label}
                      </Typography>
                      {config.description && (
                        <Typography variant="caption" color="text.secondary">
                          {config.description}
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{ m: 0, width: "100%" }}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : "Save Preferences"}
        </Button>
      </Box>
    </Paper>
  );
};

export default NotificationsSettings;