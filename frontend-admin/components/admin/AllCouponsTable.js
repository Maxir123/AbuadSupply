// //components/admin/AllCouponsTable.js
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Switch, TextField,Tooltip,} from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../admin/layout/Loader";
import { fetchAllCoupons, adminUpdateCoupon, deleteCoupon, createCoupon } from "@/redux/adminSlice";
import ProductTable from "../common/ProductTable";
import EditProductModal from "../common/ProductEditModal";
import { useDispatch, useSelector } from "react-redux";
import SearchProducts from "../common/SearchProducts";


const AllCouponsTable = () => {
  const dispatch = useDispatch();
  const { isLoading, error, adminInfo, coupons } = useSelector((state) => state.admin);

  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [updatedCoupon, setUpdatedCoupon] = useState({
    code: "",
    discount: "",
    expiryDate: "",
    status: "",
    type: "",
    validityStart: "",
    validityEnd: "",
  });
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "Purchase",
    status: "active",
    validityStart: "",
    validityEnd: "",
  });

  useEffect(() => {
    if (adminInfo) {
      dispatch(fetchAllCoupons());
    }
  }, [dispatch, adminInfo]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

// Handle search filter with optional chaining
useEffect(() => {
  const lowerCaseQuery = searchQuery.toLowerCase();
  const filtered = coupons.filter((coupon) =>
    (coupon?.name?.toLowerCase() || "").includes(lowerCaseQuery) ||
    (coupon?._id?.toLowerCase() || "").includes(lowerCaseQuery)
  );
  setFilteredCoupons(filtered);
}, [searchQuery, coupons]);

 // Handle create coupon
  const handleCreateCouponSubmit = async () => {
    const couponData = {
      ...newCoupon,
      vendorId: adminInfo?.id,
    };
    const result = await dispatch(createCoupon(couponData));
    if (result.type === "admin/createCoupon/fulfilled") {
      toast.success("Coupon created successfully!");
      dispatch(fetchAllCoupons());
    } else {
      toast.error("Coupon creation failed.");
    }
    setOpenCreateModal(false);
  };

  // Handle status change
  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const updatedCoupon = coupons.find((coupon) => coupon._id === id);
    if (updatedCoupon) {
      const updatedData = { ...updatedCoupon, status: newStatus };
      const result = await dispatch(
        adminUpdateCoupon({ couponId: id, couponData: updatedData })
      );
      console.log("RESULT:", result);
      if (result.type === "admin/adminUpdateCoupon/fulfilled") {
        dispatch(fetchAllCoupons());
        toast.success(result.payload.message || "Status updated successfully!");
      } else {
        toast.error("Failed to update status.");
      }
    }
  };

  // Handle modal for editing
  const handleEditModalOpen = (coupon) => {
    console.log("coupon:", coupon)
    const validityStart = coupon.validityStart ? coupon.validityStart.split("T")[0] : "";
    const validityEnd = coupon.validityEnd ? coupon.validityEnd.split("T")[0] : "";

    setSelectedCoupon(coupon);
    setUpdatedCoupon({
      name: coupon.name,
      value: coupon.value.replace("%", ""),
      expiryDate: validityEnd,
      status: coupon.status,
      type: coupon.type === "Purchase" ? "Purchase" : "Delivery",
      validityStart: validityStart,
      validityEnd: validityEnd,
    });

    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setSelectedCoupon(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCoupon((prevState) => ({ ...prevState, [name]: value }));
  };

  //handle update submit
  const handleEditSubmit = async () => {
    const updatedCouponData = {
      name: updatedCoupon.name,
      value: updatedCoupon.value, 
      status: updatedCoupon.status,
      type: updatedCoupon.type,
      validityStart: updatedCoupon.validityStart,
      validityEnd: updatedCoupon.validityEnd, 
    };
    const result = await dispatch(
      adminUpdateCoupon({
        couponId: selectedCoupon.id,
        couponData: updatedCouponData,
      })
    );

    if (result.type === "admin/adminUpdateCoupon/fulfilled") {
      toast.success(result.payload.message || "Coupon updated successfully!");
      dispatch(fetchAllCoupons());
    } else {
      toast.error(result.error?.message || "Coupon update failed.");
    }
    setOpenEditModal(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (couponId) => {
    setSelectedCoupon(couponId);
    setOpenDeleteDialog(true);
  };

  // Handle coupon deletion
  const handleDeleteCoupon = async () => {
    const result = await dispatch(deleteCoupon(selectedCoupon));

    if (result.type === "admin/deleteCoupon/fulfilled") {
      toast.success("Coupon deleted!");
      dispatch(fetchAllCoupons());
    } else {
      toast.error("Failed to delete coupon.");
    }
    setOpenDeleteDialog(false);
  };


  const columns = [
    { field: "name", headerName: "Coupon Name", minWidth: 150, flex: 1 },
    { field: "value", headerName: "Value", minWidth: 100, flex: 1 },
    {
      field: "type",
      headerName: "Type",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        const type = params.row.type;
        let typeStyle = {};
  
        if (type === "Purchase") {
          typeStyle = { color: "#4caf50" };
        } else if (type === "Delivery") {
          typeStyle = { color: "#f44336" }; 
        }
  
        return <div style={typeStyle}>{type}</div>;
      },
    },
    {
      field: "validityStart",
      headerName: "Validity Start",
      minWidth: 150,
      flex: 1,
      renderCell: (params) =>
        new Date(params.row.validityStart).toLocaleDateString(),
    },
    {
      field: "validityEnd",
      headerName: "Validity End",
      minWidth: 150,
      flex: 1,
      renderCell: (params) =>
        new Date(params.row.validityEnd).toLocaleDateString(),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.status === "active"}
          onChange={() => handleStatusChange(params.row.id, params.row.status)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div style={{ paddingTop: "13px", display: "flex", justifyContent: "flex-start", gap: "10px", flexWrap: "wrap" }}
        >
          <Tooltip title="Edit">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEditModalOpen(params.row)} 
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
            >
              <AiOutlineDelete size={16} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = filteredCoupons?.map((coupon, index) => ({
    id: coupon._id ?? index,
    name: coupon.name,
    value: `${coupon.value}%`,
    type: coupon.type,
    validityStart: coupon.validityStart,
    validityEnd: coupon.validityEnd,
    status: coupon.status,
  }));

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 md:p-8 rounded-md">
          <div className="flex items-center mb-6">
            <i className="fas fa-tags text-2xl text-orange-500 mr-2"></i>
            <h1 className="text-2xl font-semibold">Coupons List</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {coupons?.length || 0}
            </span>
          </div>

          {/* Create Coupon Button */}
          <div className="mb-4 text-right">
            <Button
              variant="contained"
              color="primary"
              onClick={ () => setOpenCreateModal(true)}
            >
              Add Coupon
            </Button>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
          </div>
            
          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable rows={rows} columns={columns} getRowId={(row) => row.id} />
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      <EditProductModal
        open={openEditModal}
        onClose={handleEditModalClose}
        data={updatedCoupon}
        onInputChange={handleInputChange}
        onSave={handleEditSubmit}
        isCouponEdit={true}
      />

      {/* Create Coupon Modal */}
      <Dialog open={openCreateModal} onClose={ () => setOpenCreateModal(false)}>
        <DialogTitle>Create Coupon</DialogTitle>
        <DialogContent>
          <TextField
            label="Coupon Name"
            name="code"
            value={newCoupon.code}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, code: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discount"
            name="discount"
            value={newCoupon.discount}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, discount: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            name="type"
            value={newCoupon.type}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, type: e.target.value })
            }
            fullWidth
            margin="normal"
            select
          >
            <MenuItem value="Purchase">Purchase</MenuItem>
            <MenuItem value="Delivery">Delivery</MenuItem>
          </TextField>
          <TextField
            label="Validity Start"
            name="validityStart"
            type="date"
            value={newCoupon.validityStart}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, validityStart: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Validity End"
            name="validityEnd"
            type="date"
            value={newCoupon.validityEnd}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, validityEnd: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => setOpenCreateModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateCouponSubmit} color="primary">
            Create Coupon
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this coupon?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCoupon}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllCouponsTable;
