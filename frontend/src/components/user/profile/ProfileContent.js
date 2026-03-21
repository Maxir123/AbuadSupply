import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Grid,
  TextField,
  Avatar,
  IconButton,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import {
  updateUserAvatar,
  updateUserInformation,
} from "@/redux/slices/userSlice";

const ProfileContent = () => {
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = userInfo._id;

    try {
      const result = await dispatch(
        updateUserInformation({
          name,
          email,
          phoneNumber: String(phoneNumber),
          password,
          id,
        })
      );

      if (result.type === "user/updateUserInformation/fulfilled") {
        toast.success("User information updated successfully!");
      } else {
        throw new Error(result.payload || "Error updating user information");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected.");

    const id = userInfo._id;

    try {
      const result = await dispatch(updateUserAvatar({ id, avatar: file }));

      if (result.type === "user/updateUserAvatar/fulfilled") {
        toast.success("Avatar updated successfully!");
      } else {
        throw new Error(result.payload || "Error updating avatar");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  if (!mounted) return null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        mt: { xs: 2, md: 4 },
        mb: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 0 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{ fontWeight: 600, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Profile Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your personal information and security
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Avatar section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={userInfo?.avatar?.url || ""}
                alt={name || "Profile"}
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  border: "3px solid",
                  borderColor: "primary.main",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <label htmlFor="user-image">
                <input
                  type="file"
                  id="user-image"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                />
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    backgroundColor: "background.paper",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover": { backgroundColor: "grey.100" },
                    transition: "all 0.2s",
                  }}
                >
                  <AiOutlineCamera style={{ color: "#555" }} />
                </IconButton>
              </label>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  fullWidth
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  fullWidth
                  type="password"
                  placeholder="Leave blank to keep same password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    backgroundColor: "#dc2626", // a slightly softer red
                    "&:hover": {
                      backgroundColor: "#b91c1c",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileContent;