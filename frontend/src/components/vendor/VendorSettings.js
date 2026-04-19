// Third-party library imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AiOutlineCamera } from 'react-icons/ai';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Save, Edit } from '@mui/icons-material';
import StoreIcon from '@mui/icons-material/Store';
// Local imports (Redux slice and component)
import { updateVendorAvatar, updateVendorInformation } from '@/redux/slices/vendorSlice';
import Loader from './layout/Loader';
import ClientOnly from '../common/ClientOnly';
import Image from 'next/image';

const VendorSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { vendorInfo, isLoading } = useSelector((state) => state.vendors);
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [email, setEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const dispatch = useDispatch();

  // Initialize local state from vendorInfo
  useEffect(() => {
    if (vendorInfo) {
      setAvatar(vendorInfo.avatar?.url || '');
      setName(vendorInfo.name || '');
      setDescription(vendorInfo.description || '');
      setAddress(vendorInfo.address || '');
      setPhoneNumber(vendorInfo.phoneNumber || '');
      setZipCode(vendorInfo.zipCode || '');
      setEmail(vendorInfo.email || '');
    }
  }, [vendorInfo]);

  const updateVendorHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        updateVendorInformation({
          name,
          description,
          address,
          phoneNumber,
          zipCode,
          email,
          id: vendorInfo?._id,
        })
      );
      if (result.type === 'vendor/updateVendorInformation/fulfilled') {
        toast.success('Vendor information updated successfully!');
      } else {
        throw new Error(result.payload || 'Error updating vendor information');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }
    setAvatarUploading(true);
    try {
      const result = await dispatch(updateVendorAvatar({ id: vendorInfo._id, avatar: file }));
      if (result.type === 'vendor/updateVendorAvatar/fulfilled') {
        toast.success('Avatar updated successfully!');
        // Update local preview
        const reader = new FileReader();
        reader.onload = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
      } else {
        throw new Error(result.payload || 'Error updating avatar');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const avatarSrc = avatar || '/images/store-backup.png';

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ClientOnly>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 1000,
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.100',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h5" fontWeight="bold">
              Vendor Settings
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Manage your store profile and bank details
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Avatar Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
              <Avatar src={avatarSrc} sx={{ width: 120, height: 120, border: '3px solid', borderColor: 'primary.main' }}>
                {!avatarSrc && <StoreIcon />}
              </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'white',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                  disabled={avatarUploading}
                >
                  <input type="file" hidden accept="image/*" onChange={handleImage} />
                  {avatarUploading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AiOutlineCamera size={20} color="#3ad132" />
                  )}
                </IconButton>
              </Box>
            </Box>

            <form onSubmit={updateVendorHandler}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth={isMobile}
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                    sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                  >
                    {isSubmitting ? 'Saving...' : 'Update Store Information'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Divider sx={{ my: 4 }} />

            {/* Bank Information Section */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Bank Information
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Account Holder
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {vendorInfo?.vendorBankInfo?.accountHolderName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Bank Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {vendorInfo?.vendorBankInfo?.bankName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Account Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {vendorInfo?.vendorBankInfo?.bankAccountNumber || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  IBAN
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {vendorInfo?.vendorBankInfo?.iban || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            {!vendorInfo?.vendorBankInfo && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No bank information added yet. Please go to the{' '}
                <strong>Bank Information</strong> page to add your bank details.
              </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </ClientOnly>
  );
};

export default VendorSettings;