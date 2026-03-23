import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings, updateSiteSettings } from "@/redux/siteSettingsSlice";
import { toast } from "react-toastify";
import Image from "next/image";
import { CloudUpload } from "@mui/icons-material";

const AdminGeneralSettings = () => {
  const dispatch = useDispatch();
  const { siteSettings, isLoading, successMessage, error } = useSelector((state) => state.settings);
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    supportPhone: "",
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (siteSettings) {
      setSettings({
        siteName: siteSettings.siteName || "",
        siteDescription: siteSettings.siteDescription || "",
        contactEmail: siteSettings.contactEmail || "",
        supportPhone: siteSettings.supportPhone || "",
        logo: null,
      });
      if (siteSettings.logo?.url) {
        setLogoPreview(siteSettings.logo.url);
      }
    }
  }, [siteSettings]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (error) toast.error(error);
  }, [successMessage, error]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB) and type
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file must be less than 2MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, and WEBP images are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setSettings((prev) => ({ ...prev, logo: file }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await dispatch(updateSiteSettings(settings)).unwrap();
      // Optional: reload settings after update
      dispatch(fetchSiteSettings());
    } catch (err) {
      // error already handled by slice (toast)
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
        General Site Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure the main information about your online store
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Site Name"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            fullWidth
            required
            placeholder="ShopQ"
            helperText="This will appear in the browser title and header"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Support Phone"
            name="supportPhone"
            value={settings.supportPhone}
            onChange={handleChange}
            fullWidth
            placeholder="+234 123 456 7890"
            InputProps={{
              startAdornment: <InputAdornment position="start">📞</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Site Description"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Your go-to multivendor marketplace for everything from fashion to electronics."
            helperText="Used in meta descriptions and site-wide SEO"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={handleChange}
            fullWidth
            required
            placeholder="support@shopq.com"
            InputProps={{
              startAdornment: <InputAdornment position="start">✉️</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Placeholder for future field if needed */}
        </Grid>
      </Grid>

      {/* Logo Upload Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Site Logo
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 3,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          {logoPreview && (
            <Box sx={{ position: "relative", width: 120, height: 60 }}>
              <Image
                src={logoPreview}
                alt="Site Logo Preview"
                fill
                sizes="120px"
                style={{ objectFit: "contain" }}
                unoptimized
                priority
              />
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Upload Logo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                hidden
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
              Recommended size: 200x80px. Max 2MB. JPEG, PNG, WEBP.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={saving}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : "Save Settings"}
        </Button>
      </Box>
    </Paper>
  );
};

export default AdminGeneralSettings;