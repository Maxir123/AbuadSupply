import React, { useEffect, useState } from "react";

// Third-party library imports
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Typography,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";

// Local imports
import Loader from "./layout/Loader";
import { deleteOrder, fetchOrders, fetchSingleOrder, updateOrder, updateOrderStatus} from "@/redux/adminSlice";
import ProductTable from "../common/ProductTable";
import SearchProducts from "../common/SearchProducts";
import EditProductModal from "../common/ProductEditModal";

const AllOrdersTable = () => {
  const dispatch = useDispatch();
  const { singleOrder, orders, isLoading, error } = useSelector( (state) => state.admin);

  //State Variables (Local), Filtering and search state
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal visibility state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);

  // Selected order state for deletion/editing/viewing
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState({
    status: "",
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    totalAmount: 0,
    paymentInfo: { method: "", status: "" },
  });

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  
  
  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) => {
        const fullName = order?.shippingAddress?.fullName?.toLowerCase() || "";
        const orderId = order?._id?.toLowerCase() || "";
        const status = order?.status?.toLowerCase() || "";

        const query = searchQuery.toLowerCase();

        return (
          fullName.includes(query) ||
          orderId.includes(query) ||
          status.includes(query)
        );
      })
    );
  }, [searchQuery, orders]);

  /* ====== Handlers – Order Status Update ======= */
  const handleStatusChange = async (orderId, status) => {
    try {
      const result = await dispatch(updateOrderStatus({ id: orderId, status }));
      if (result.type === "admin/updateOrderStatus/fulfilled") {
        toast.success(result.payload?.message);
        dispatch(fetchOrders());
      } else {
        toast.error(result.payload?.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status.");
    }
  };

    /* ====== Handlers – Deletion ======= */
  // open confirmation dialog
  const handleDeleteConfirmation = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return;
    console.log("selectedOrderId:", selectedOrderId)
    try {
      const result = await dispatch(deleteOrder({ id: selectedOrderId }));
      if (result.type === "admin/deleteOrder/fulfilled") {
        toast.success("Order deleted!");
        dispatch(fetchOrders());
      } else {
        toast.error("Failed to delete order.");
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error("An error occurred while deleting the order.");
    }
  };

  /* ====== Handlers – Search ======= */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /* ====== Handlers – Input Change (Nested Keys) ======= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Check if the name is nested (contains a dot)
    if (name.includes(".")) {
      const keys = name.split(".");
      // keys[0] = "shippingAddress", keys[1] = "fullName"
      setUpdatedOrder((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setUpdatedOrder((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ====== Handlers – Editing ======= */
  const handleOrderEdit = (order) => {
    console.log("ORDER:", order); //Logs the order including ID
    setSelectedOrderId(order.id);
    setUpdatedOrder({
      status: order.status,
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      paymentInfo: order.paymentInfo,
    });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedOrderId(null);
  };

  const handleUpdateOrder = async () => {
    try {
      const result = await dispatch(
        updateOrder({
          id: selectedOrderId,
          status: updatedOrder.status,
          updatedOrder,
        })
      );
      console.log("selectedOrderId:", selectedOrderId); 
      if (result.type === "admin/updateOrder/fulfilled") {
        toast.success("Order updated successfully!");
        dispatch(fetchOrders());
        setOpenEditModal(false);
      } else {
        toast.error("Failed to update the order.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  /* ======  Handlers – Viewing Order Details ======= */
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

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 1 },
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
      field: "shippingAddress",
      headerName: "Shipping Address",
      minWidth: 250,
      flex: 1,
      renderCell: ({ row }) => (
        <div>
          {row.shippingAddress.address} - {row.shippingAddress.city}{" "}
          {row.shippingAddress.zipCode} {row.shippingAddress.country}
        </div>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => <div>{row.paymentInfo.method}</div>,
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => <div>{row.paymentInfo.status}</div>,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) => (
        <FormControl fullWidth>
          <Select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
          >
            {[
              "processing",
              "shipped",
              "delivered",
              "cancelled",
              "Processing refund",
              "refund_approved",
              "refund_rejected",
            ].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
{
  field: "actions",
  headerName: "Actions",
  minWidth: 200,
  flex: 1,
  renderCell: (params) => (
    <div
      style={{
        paddingTop: "13px",
        display: "flex",
        justifyContent: "flex-start",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <Tooltip title="Edit">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleOrderEdit(params.row)}
          style={{
            padding: "6px 12px",
            minWidth: "auto",
            fontSize: "14px",
          }}
        >
          <AiOutlineEdit size={16} />
        </Button>
      </Tooltip>
      <Tooltip title="Delete">
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDeleteConfirmation(params.row.id)}
          style={{
            padding: "6px 12px",
            minWidth: "auto",
            fontSize: "14px",
          }}
        >
          <AiOutlineDelete size={16} />
        </Button>
      </Tooltip>
      <Tooltip title="View">
        <Button
          variant="contained"
          color="info"
          size="small"
          onClick={() => handleViewOrder(params.row.id)}
          style={{
            padding: "6px 12px",
            minWidth: "auto",
            fontSize: "14px",
          }}
        >
          <AiOutlineEye size={16} />
        </Button>
      </Tooltip>
    </div>
  ),
}

  ];

  const rows = filteredOrders.map((order) => ({
    id: order._id,
    customerName: order.shippingAddress.fullName,
    totalAmount: order.totalPrice,
    status: order.status,
    shippingAddress: order.shippingAddress,
    paymentInfo: order.paymentInfo,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-gray-100 p-4 md:p-8 rounded-md">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-semibold">Orders List</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {orders?.length || 0}
            </span>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange}/>
          </div>

          {/* Data Table Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6"> 
            <ProductTable rows={rows} columns={columns} /> 
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      <EditProductModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        data={updatedOrder}
        onInputChange={handleInputChange}
        onSave={handleUpdateOrder}
        isOrderEdit={true}
      />

      {/* View Order Modal */}
      <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" fullWidth>
        <DialogTitle style={{ fontWeight: "bold" }}>Order Details</DialogTitle>
        <DialogContent>
          {isLoading ? ( 
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </div>
          ) : singleOrder ? (
            <div>
              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">
                    Order ID: {singleOrder._id}
                  </Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Status:</strong> {singleOrder.status}
                    <div style={{ marginTop: "10px" }}>
                      {singleOrder.status === "delivered" ? (
                        <IconButton style={{ color: "green" }}>
                          <AiOutlineCheckCircle size={20} />
                        </IconButton>
                      ) : (
                        <IconButton style={{ color: "red" }}>
                          <AiOutlineCloseCircle size={20} />
                        </IconButton>
                      )}
                    </div>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
                    <strong>Created At:</strong> {new Date(singleOrder.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">Shipping Address</Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2">
                    <strong>Name:</strong>{" "}
                    {singleOrder.shippingAddress.fullName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong>{" "}
                    {singleOrder.shippingAddress.address},{" "}
                    {singleOrder.shippingAddress.city},{" "}
                    {singleOrder.shippingAddress.country},{" "}
                    {singleOrder.shippingAddress.postalCode}
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">Payment Information</Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2">
                    <strong>Method:</strong> {singleOrder.paymentInfo.method}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {singleOrder.paymentInfo.status}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6">Items</Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <ul>
                    {singleOrder.items.map((item) => (
                      <li key={item._id}>
                        <Typography variant="body2">
                          <strong>{item.name}</strong> - {item.quantity} x $
                          {item.price}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                  <Typography variant="h6">
                    <strong>Total:</strong> ${singleOrder.totalPrice}
                  </Typography>
                </CardContent>
              </Card>
            </div>
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

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this order?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteOrder} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllOrdersTable;
