// AllRefundsTable.js
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchOrders, fetchSingleOrder, updateOrderStatus, adminRefundOrder } from "@/redux/adminSlice";

// Local imports
import Loader from "../admin/layout/Loader";
import ProductTable from "../common/ProductTable";
import SearchProducts from "../common/SearchProducts";

const AllRefundsTable = () => {
  const dispatch = useDispatch();

  // State from Redux
  const { orders, singleOrder, isLoading } = useSelector((state) => state.admin);

  // Local component states
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openViewModal, setOpenViewModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!orders?.length) {
      setFilteredOrders([]);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(lowerQuery) ||
        order.status.toLowerCase().includes(lowerQuery) ||
        order.shippingAddress.fullName.toLowerCase().includes(lowerQuery)
    );
    setFilteredOrders(filtered);
  }, [orders, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewOrder = async (orderId) => {
    try {
      await dispatch(fetchSingleOrder(orderId));
      setOpenViewModal(true);
    } catch (error) {
      toast.error("Failed to fetch order details.");
    }
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (newStatus === "refund_approved" || newStatus === "refund_rejected") {
        const result = await dispatch(
          adminRefundOrder({ orderId, status: newStatus })
        );
        if (result.type === "admin/adminRefundOrder/fulfilled") {
          toast.success("Refund status updated");
          dispatch(fetchOrders());
        } else {
          toast.error("Failed to update refund status");
        }
      } else {
        const result = await dispatch( updateOrderStatus({ id: orderId, status: newStatus }) );
        console.log("RESULT", result)
        if (result.type === "admin/updateOrderStatus/fulfilled") {
          toast.success(result.payload?.message || "Status updated");
          dispatch(fetchOrders());
        } else {
          toast.error("Failed to update order status");
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status.");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => `$${params.row.totalAmount}`,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 220,
      flex: 1,
      renderCell: ({ row }) => {
        if (row.status === "Processing refund") {
          // If status is "Processing refund", show a special dropdown
          return (
            <FormControl fullWidth>
              <Select
                value={row.status}
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
              >
                <MenuItem value="Processing refund">Processing refund</MenuItem>
                <MenuItem value="refund_approved">Approve Refund</MenuItem>
                <MenuItem value="refund_rejected">Reject Refund</MenuItem>
              </Select>
            </FormControl>
          );
        }
        // Otherwise, normal statuses
        return (
          <FormControl fullWidth>
            <Select
              value={row.status}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
            >
              <MenuItem value="processing">processing</MenuItem>
              <MenuItem value="shipped">shipped</MenuItem>
              <MenuItem value="delivered">delivered</MenuItem>
              <MenuItem value="cancelled">cancelled</MenuItem>
              <MenuItem value="Processing refund">Processing refund</MenuItem>
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title="View Order">
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => handleViewOrder(params.row.id)}
          >
            <AiOutlineEye size={16} />
          </Button>
        </Tooltip>
      ),
    },
  ];

  // Prepare the rows
  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress.fullName,
    totalAmount: order.totalPrice,
    status: order.status,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-gray-100 p-4 md:p-8 rounded-md">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-semibold">Refund Orders</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {orders?.length || 0}
            </span>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <SearchProducts
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          </div>

          {/* Data Table Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable rows={rows} columns={columns} />
          </div>
        </div>
      )}

      {/* View Order Modal */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle style={{ fontWeight: "bold" }}>Order Details</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
              <CircularProgress />
            </div>
          ) : singleOrder ? (
            <>
              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">Order ID: {singleOrder._id}</Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography>
                    <strong>Status:</strong> {singleOrder.status}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> ${singleOrder.totalPrice}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    <strong>Items:</strong>
                  </Typography>
                  {singleOrder.items?.map((item) => (
                    <li key={item._id}>
                      {item.name} (x{item.quantity}) - ${item.price}
                    </li>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Order details are not available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllRefundsTable;
