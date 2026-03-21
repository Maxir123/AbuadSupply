// Third-party library imports
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCrosshair1 } from "react-icons/rx";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";

// Local imports (Redux slices)
import { addUserAddress, deleteUserAddress } from "@/redux/slices/userSlice";

// MUI components
import {
  Table,
  Box,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  IconButton,
  DialogActions,
  useMediaQuery,
  useTheme,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [addressType, setAddressType] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addressTypeData = [{ name: "Home" }, { name: "Office" }];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || state === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      const addressData = {
        country,
        state,
        city,
        street,
        zipCode,
        addressType,
      };
      const result = await dispatch(addUserAddress(addressData));

      if (result.type === "user/addUserAddress/fulfilled") {
        toast.success(result.payload.message);
      } else if (result.type === "user/addUserAddress/rejected") {
        toast.error(result.payload);
      }
      setOpen(false);
      setCountry("");
      setState("");
      setCity("");
      setStreet("");
      setZipCode("");
      setAddressType("");
    }
  };

  const handleDelete = async (addressId) => {
    const result = await dispatch(deleteUserAddress(addressId));

    if (result.type === "user/deleteUserAddress/fulfilled") {
      toast.success(result.payload.message);
    } else if (result.type === "user/deleteUserAddress/rejected") {
      toast.error(result.payload);
    }
  };

  if (!isClient) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight={600} color="text.primary">
          My Addresses
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#2563eb", // soft blue
            "&:hover": { bgcolor: "#1d4ed8" },
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          Add New Address
        </Button>
      </Box>

      {/* Add Address Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Add New Address
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <RxCrosshair1 />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <form onSubmit={handleSubmit} id="address-form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  fullWidth
                  required
                  size="small"
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Select Country
                  </MenuItem>
                  {Country.getAllCountries().map((item) => (
                    <MenuItem key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="State / Region"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  fullWidth
                  disabled={!country}
                  required
                  size="small"
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    {country ? "Select State" : "Select Country first"}
                  </MenuItem>
                  {State.getStatesOfCountry(country).map((item) => (
                    <MenuItem key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                  disabled={!state}
                  required
                  size="small"
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    {state ? "Select City" : "Select State first"}
                  </MenuItem>
                  {City.getCitiesOfState(country, state).map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  fullWidth
                  required
                  size="small"
                  placeholder="House number, street name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Zip Code"
                  type="number"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Address Type"
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  fullWidth
                  required
                  size="small"
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Select Type
                  </MenuItem>
                  {addressTypeData.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="address-form"
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
              textTransform: "none",
            }}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address List - Responsive Table / Cards */}
      {userInfo?.addresses?.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          {isMobile ? (
            // Mobile view: Card list
            <Box sx={{ p: 2 }}>
              {userInfo.addresses.map((item) => (
                <Card
                  key={item._id}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.addressType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {item.street}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.city}, {item.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Zip Code: {item.zipCode}
                        </Typography>
                      </Box>
                      <IconButton onClick={() => handleDelete(item._id)} size="small">
                        <AiOutlineDelete color="#ef4444" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop view: Table
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Address Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Street</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>City / Country</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Zip Code</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 80 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userInfo.addresses.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Chip
                          label={item.addressType}
                          size="small"
                          sx={{
                            bgcolor: "#e0e7ff",
                            color: "#1e3a8a",
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>{item.street}</TableCell>
                      <TableCell>
                        {item.city}, {item.country}
                      </TableCell>
                      <TableCell>{item.zipCode}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDelete(item._id)}
                          size="small"
                          sx={{ color: "#ef4444" }}
                        >
                          <AiOutlineDelete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      ) : (
        <Paper
          sx={{
            py: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            You do not have any saved addresses.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setOpen(true)}
            sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
          >
            Add Your First Address
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Address;