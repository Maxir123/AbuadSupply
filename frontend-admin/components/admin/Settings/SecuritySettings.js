import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Lock, VpnKey, CheckCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminSecurity } from "@/redux/adminSlice";
import { toast } from "react-toastify";

const SecuritySettings = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.admin);
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = securityData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setSaving(true);
    try {
      const result = await dispatch(updateAdminSecurity(securityData)).unwrap();
      toast.success("Password updated successfully!");
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      toast.error(error || "Password update failed.");
    } finally {
      setSaving(false);
    }
  };

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
        Security Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your password to keep your account secure.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <TextField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={securityData.currentPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          value={securityData.newPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VpnKey fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          helperText="At least 6 characters"
        />
        <TextField
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          value={securityData.confirmNewPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CheckCircle fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={saving || isLoading}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SecuritySettings;