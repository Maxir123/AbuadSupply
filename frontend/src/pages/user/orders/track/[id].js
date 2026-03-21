import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getUserAllOrders } from "@/redux/slices/orderSlice";
import { Box,Typography,Button,Card,CardContent,Stack,Paper,Stepper,Step,StepLabel} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Link from "next/link";

const TrackOrderPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.user);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getUserAllOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);

  const orderSteps = [
    { status: "processing", label: "Processing" },
    { status: "shipped", label: "Shipped" },
    { status: "delivered", label: "Delivered" },
    { status: "cancelled", label: "Cancelled" },
    { status: "Processing refund", label: "Refund Requested" },
    { status: "refund_approved", label: "Refund Approved" },
    { status: "refund_rejected", label: "Refund Rejected" },
  ];

  const order = orders.find((order) => order._id === id);
  const currentStepIndex = orderSteps.findIndex(
    (step) => step.status === order?.status
  );

  const getStepColor = (status, isActive) => {
    if (status === "cancelled" || status === "refund_rejected")
      return isActive ? "error.main" : "text.secondary";
    if (status === "refund_approved") return "success.main";
    return isActive ? "primary.main" : "text.secondary";
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ShoppingBagIcon color="error" />
          <Typography variant="h5" fontWeight="bold">
            Order Details
          </Typography>
        </Stack>
        <Link href="/user/orders/track-order" passHref>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" color="error">
            Back
          </Button>
        </Link>
      </Stack>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <strong>Order ID:</strong> #{order?._id?.slice(0, 8)}
          </Typography>
          <Typography variant="body1">
            <strong>Placed On:</strong> {order?.createdAt?.slice(0, 10)}
          </Typography>
        </CardContent>
      </Card>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Order Status Progress
        </Typography>
        <Stepper activeStep={currentStepIndex} orientation="vertical" sx={{ pt: 2 }}>
          {orderSteps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            return (
              <Step key={step.status} active={isActive}>
                <StepLabel
                  sx={{
                    color: getStepColor(step.status, isActive),
                    ".MuiStepLabel-label": {
                      fontWeight: 500,
                      fontSize: "1rem",
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default TrackOrderPage;
