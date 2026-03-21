import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress,} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteSettings, updateSiteSettings } from "@/redux/siteSettingsSlice";
import { toast } from "react-toastify";
import Image from "next/image";

const AdminGeneralSettings = () => {
  const dispatch = useDispatch();
  const { siteSettings, isLoading, successMessage, error } = useSelector((state) => state.settings );
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    supportPhone: "",
    logo: null, 
  });

  // For previewing the uploaded logo
  const [logoPreview, setLogoPreview] = useState("");

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

    // For immediate preview:
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setSettings((prev) => ({ ...prev, logo: file }));
  };

  const handleUpdate = () => {
    dispatch(updateSiteSettings(settings));
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        General Site Settings
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <TextField
            label="Site Name"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Site Description"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            label="Contact Email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Support Phone"
            name="supportPhone"
            value={settings.supportPhone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Box sx={{ my: 2 }}>
            <Typography>Site Logo</Typography>
            {logoPreview && (
              <Box sx={{ my: 1, position: "relative", width: 120, height: 60 }}>
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
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleUpdate}
          >
            Save Settings
          </Button>
        </>
      )}
    </Box>
  );
};

export default AdminGeneralSettings;
