import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminSecurity, fetchAdminProfile } from "@/redux/adminSlice";
import { toast } from "react-toastify";

const SecuritySettings = () => {
  const dispatch = useDispatch();
  const {  isLoading, successMessage, } = useSelector((state) => state.admin);
console.log("successMessage:", successMessage)
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  const handleChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (securityData.newPassword !== securityData.confirmNewPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
  
    const result = await dispatch(updateAdminSecurity(securityData));
  console.log("Result", result)
    if (result.type === "admin/updateAdminSecurity/fulfilled") {
      toast.success("Password updated successfully!");
      // Optionally reset fields:
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } else {
      toast.error(result.payload || "Password update failed.");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      <TextField
        label="Current Password"
        name="currentPassword"
        type="password"
        value={securityData.currentPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Password"
        name="newPassword"
        type="password"
        value={securityData.newPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirm New Password"
        name="confirmNewPassword"
        type="password"
        value={securityData.confirmNewPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdate}>
        Update Password
      </Button>
    </Box>
  );
};

export default SecuritySettings;
