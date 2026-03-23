import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  TextField,
  Button,
  Paper,
  Grid,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings, updateSiteSettings } from "@/redux/siteSettingsSlice";
import { toast } from "react-toastify";

const AdvancedSettings = () => {
  const dispatch = useDispatch();
  const { siteSettings } = useSelector((state) => state.settings);

  const [advanced, setAdvanced] = useState({
    maintenanceMode: false,
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    enableErrorLogging: true,
    adminOnlyMode: false,
    maintenanceEndTime: "",
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
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: "1px solid", borderColor: "grey.100" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Advanced Site Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure system‑level behavior and maintenance options
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Switches */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={<Switch checked={advanced.maintenanceMode} onChange={() => handleToggle("maintenanceMode")} />}
            label="Maintenance Mode"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={<Switch checked={advanced.adminOnlyMode} onChange={() => handleToggle("adminOnlyMode")} />}
            label="Admin-Only Mode"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={<Switch checked={advanced.enableErrorLogging} onChange={() => handleToggle("enableErrorLogging")} />}
            label="Enable Error Logging"
          />
        </Grid>
      </Grid>

      {/* Maintenance End Date (only when maintenance is ON) */}
      {advanced.maintenanceMode && (
        <Box sx={{ mt: 2, mb: 3 }}>
          <TextField
            name="maintenanceEndTime"
            label="Maintenance End Time"
            type="datetime-local"
            value={advanced.maintenanceEndTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText="Set when the maintenance should end. Leave empty for indefinite."
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Meta fields */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="defaultMetaTitle"
            label="Default Meta Title"
            value={advanced.defaultMetaTitle}
            placeholder="ShopQ - All You Need"
            onChange={handleChange}
            fullWidth
            helperText="Used when no custom meta title is provided"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="defaultMetaDescription"
            label="Default Meta Description"
            value={advanced.defaultMetaDescription}
            placeholder="Your go-to multivendor marketplace for everything from fashion to electronics."
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            helperText="Used when no custom meta description is provided"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleSave} sx={{ width: { xs: "100%", sm: "auto" } }}>
          Save Advanced Settings
        </Button>
      </Box>
    </Paper>
  );
};

export default AdvancedSettings;