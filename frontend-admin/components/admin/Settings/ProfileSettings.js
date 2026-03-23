// components/admin/AdminProfileSettings.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  InputAdornment,
} from "@mui/material";
import { CloudUpload, Person, Email, Phone, Lock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfile, updateAdminProfile } from "@/redux/adminSlice";
import { toast } from "react-toastify";
import Image from "next/image";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { adminInfo, isLoading, error, successMessage } = useSelector((state) => state.admin);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    avatar: "",
    password: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (adminInfo) {
      setProfile({
        name: adminInfo.name || "",
        email: adminInfo.email || "",
        phoneNumber: adminInfo.phoneNumber || "",
        avatar: adminInfo.avatar?.url || "",
        password: "",
      });
      setAvatarPreview(adminInfo.avatar?.url || null);
    }
  }, [adminInfo]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (error) toast.error(error);
  }, [successMessage, error]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or WEBP images are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setProfile({ ...profile, avatar: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setSaving(true);
    const updatedProfile = { ...profile };
    if (!updatedProfile.password) delete updatedProfile.password;
    try {
      await dispatch(updateAdminProfile(updatedProfile)).unwrap();
      // After successful update, fetch the latest profile to refresh avatar
      dispatch(fetchAdminProfile());
    } catch (err) {
      // Error already handled by slice
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
        Profile Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your personal information and avatar
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
            helperText="Leave blank to keep current password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Avatar Upload Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Avatar
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
          {avatarPreview && (
            <Box sx={{ position: "relative", width: 80, height: 80 }}>
              <Image
                src={avatarPreview}
                alt="Avatar Preview"
                fill
                sizes="80px"
                style={{ borderRadius: "50%", objectFit: "cover" }}
                unoptimized
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
              Upload Avatar
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
              Recommended size: 200x200px. Max 2MB. JPEG, PNG, WEBP.
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
          {saving ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileSettings;