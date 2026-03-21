import React, { useEffect, useState } from "react";
import { Box, Typography, Switch, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings, updateSiteSettings } from "@/redux/siteSettingsSlice";
import { toast } from "react-toastify";

const AdvancedSettings = () => {
  const dispatch = useDispatch();
  const { siteSettings } = useSelector(state => state.settings);

  const [advanced, setAdvanced] = useState({
    maintenanceMode: false,
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    enableErrorLogging: true,
    adminOnlyMode: false,
    maintenanceEndTime: ""
  });

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (siteSettings?.advanced) {
      const adv = siteSettings.advanced;
      setAdvanced({
        maintenanceMode: adv.maintenanceMode === true || adv.maintenanceMode === "true",
        adminOnlyMode: adv.adminOnlyMode === true || adv.adminOnlyMode === "true",
        enableErrorLogging: adv.enableErrorLogging === true || adv.enableErrorLogging === "true",
        defaultMetaTitle: adv.defaultMetaTitle || "",
        defaultMetaDescription: adv.defaultMetaDescription || "",
        maintenanceEndTime: adv.maintenanceEndTime
          ? new Date(adv.maintenanceEndTime).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [siteSettings]);

  const handleToggle = (key) => {
    setAdvanced({ ...advanced, [key]: !advanced[key] });
  };

  const handleChange = (e) => {
    setAdvanced({ ...advanced, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const result = await dispatch(updateSiteSettings({ advanced }));
    if (result.type === "settings/updateSiteSettings/fulfilled") {
      toast.success("Advanced settings updated");
      await dispatch(fetchSiteSettings());
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>Advanced Site Settings</Typography>

      {/* Maintenance Mode Toggle */}
      <Switch
        checked={advanced.maintenanceMode}
        onChange={() => handleToggle("maintenanceMode")}
      />
      <Typography>Maintenance Mode</Typography>

      {/* Only show date-time input if maintenance is ON */}
      {advanced.maintenanceMode && (
        <TextField
          name="maintenanceEndTime"
          label="Maintenance End Time"
          type="datetime-local"
          value={advanced.maintenanceEndTime}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      )}

      <Switch
        checked={advanced.adminOnlyMode}
        onChange={() => handleToggle("adminOnlyMode")}
      />
      <Typography>Admin-Only Mode</Typography>

      <Switch
        checked={advanced.enableErrorLogging}
        onChange={() => handleToggle("enableErrorLogging")}
      />
      <Typography>Enable Error Logging</Typography>

      <TextField
        name="defaultMetaTitle"
        label="Default Meta Title"
        value={advanced.defaultMetaTitle}
        placeholder="ShopQ - All You Need"
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        name="defaultMetaDescription"
        label="Default Meta Description"
        value={advanced.defaultMetaDescription}
        placeholder="Your go-to multivendor marketplace for everything from fashion to electronics."
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
        Save Advanced Settings
      </Button>
    </Box>
  );
};

export default AdvancedSettings;
