import React, { useEffect, useState } from "react";

// Third-party library imports
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider,Typography,} from "@mui/material";
import { Tooltip, Switch } from "@mui/material";
import { toast } from "react-toastify";
import { format } from "date-fns";

// Local imports
import { fetchAllVendors, blockVendor, unblockVendor, fetchVendorById, updateVendor, deleteVendor} from "@/redux/adminSlice";
import EditProductModal from "../common/ProductEditModal";
import ProductTable from "../common/ProductTable";
import SearchProducts from "../common/SearchProducts";
import Loader from "./layout/Loader";
import Image from "next/image";

const AllVendorsTable = () => {
  const dispatch = useDispatch();

  const { isLoading, error, adminInfo, vendors, singleVendor } = useSelector( (state) => state.admin);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [updatedVendor, setUpdatedVendor] = useState({ name: "", email: "", contactNumber: "" });
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  useEffect(() => {
      if (adminInfo) {
        dispatch(fetchAllVendors());
      }
    }, [dispatch, adminInfo]);

  useEffect(() => {
    let filtered = [...vendors];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();

      filtered = filtered.filter((vendor) => {
        const vendorName = vendor?.name?.toLowerCase();
        const vendorId = vendor?._id?.toLowerCase();
        const email = vendor?.email?.toLowerCase();

        return (
          vendorName?.includes(lowerCaseQuery) ||
          vendorId?.includes(lowerCaseQuery) ||
          email?.includes(lowerCaseQuery)
        );
      });
    }
    setFilteredVendors(filtered);
  }, [searchQuery, vendors]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleVendorEdit = (vendor) => {
    setSelectedVendorId(vendor.id);
    setUpdatedVendor({
      name: vendor.name,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
    });
    setOpenEditModal(true);
  };
  
  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };

  const handleDeleteConfirmation = (vendorId) => {
    setSelectedVendorId(vendorId);            
    setOpenDeleteDialog(true);
  };

  const handleDeleteVendor = async () => {
    const result = await dispatch(deleteVendor(selectedVendorId));
    if (result.type === "admin/deleteVendor/fulfilled") {
      toast.success("Vendor deleted!");
    } else {
      toast.error("Failed to delete vendor.");
    }
    setOpenDeleteDialog(false);
  };

  const handleStatusToggle = async (id, isBlocked) => {
    if (isBlocked) {
      // If vendor is blocked, unblock them
      const result = await dispatch(unblockVendor(id));
      if (result.type === "admin/unblockVendor/fulfilled") {
        toast.success("Vendor unblocked successfully!");
      } else {
        toast.error("Failed to unblock vendor.");
      }
    } else {
      // If vendor is active, block them
      const result = await dispatch(blockVendor(id));
      if (result.type === "admin/blockVendor/fulfilled") {
        toast.success("Vendor blocked successfully!");
      } else {
        toast.error("Failed to block vendor.");
      }
    }
  };

  const handleViewVendor = async (vendorId) => {
    const result = await dispatch(fetchVendorById(vendorId));
    if (result.type === "admin/fetchVendorById/fulfilled") setOpenViewModal(true);
    else toast.error("Failed to fetch vendor details.");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVendor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateVendor = async () => {
    try {
      const result = await dispatch(
        updateVendor({
          id: selectedVendorId, 
          updatedVendor: updatedVendor, // Updated vendor data from the form
        })
      );
      if (result.type === "admin/updateVendor/fulfilled") {
        toast.success("Vendor updated successfully!");
        dispatch(fetchAllVendors()); 
        setOpenEditModal(false); 
      } else {
        toast.error("Failed to update the vendor.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  //Table columns and row
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const id = params.value;
        const lastSixDigits = id.slice(-6);
        return <span>{`...${lastSixDigits}`}</span>;
      },
    },
    {
      field: "registrationDate",
      headerName: "REG DATE",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        const formattedDate = format(new Date(params.value), "MMM dd, yyyy ");
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "name",
      headerName: "NAME",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "email",
      headerName: "EMAIL",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "PHONE",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "STATUS",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tooltip title={params.row.isBlocked ? "Inactive" : "Active"}>
            <Switch
              checked={!params.row.isBlocked} 
              onChange={() => handleStatusToggle(params.row.id, params.row.isBlocked) }
              disabled={!!params.row.isApproved}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
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
          {/* Edit Button with Tooltip */}
          <Tooltip title="Edit">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleVendorEdit(params.row)}
              style={{ minWidth: "auto", padding: "6px 12px" }}
            >
              <AiOutlineEdit size={16} />
            </Button>
          </Tooltip>

          {/* Delete Button with Tooltip */}
          <Tooltip title="Delete">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteConfirmation(params.row.id)}
              style={{ minWidth: "auto", padding: "6px 12px" }}
            >
              <AiOutlineDelete size={16} />
            </Button>
          </Tooltip>

          {/* Approve Button with Tooltip */}
          {!params.row.isApproved && (
            <Tooltip title="View Vendor Details">
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => handleViewVendor(params.row.id)}
                style={{ minWidth: "auto", padding: "6px 12px" }}
              >
                <AiOutlineEye size={16} />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  const rows = filteredVendors.map((vendor) => ({
    id: vendor._id, 
    registrationDate: vendor.createdAt,
    name: vendor.name,
    email: vendor.email,
    phoneNumber: vendor.phoneNumber,
    isBlocked: vendor.isBlocked,
  }));

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {isLoading ? (
        <Loader /> 
        ) : error ? (
          <div className="p-6 text-red-600">{String(error)}</div>
        ) : (
        <div className="w-full p-4 md:p-8 rounded-md">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-semibold">Vendors List</h1>
            <span className="ml-2 bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {vendors?.length || 0}
            </span>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <SearchProducts searchQuery={searchQuery} handleSearchChange={handleSearchChange}/>
          </div>

           {/* Data Table */}
           <div className="bg-white p-6 rounded-lg shadow mb-6">
            <ProductTable rows={rows} columns={columns} />
          </div>
        </div>
      )}

      {/* Vendor Details Modal */}
      <Dialog
        open={openViewModal}
        onClose={() =>  setOpenViewModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle style={{ fontWeight: "bold" }}>{singleVendor?.name ? `Details for ${singleVendor.name}` : "Vendor Details"}</DialogTitle>
        <DialogContent>
          {singleVendor ? (
            <div>
              {/* Vendor Name and Information */}
              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">
                    Vendor Name: {singleVendor.name}
                  </Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Email:</strong> {singleVendor.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Phone:</strong> {singleVendor.phoneNumber}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Address:</strong> {singleVendor.address}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Zip Code:</strong> {singleVendor.zipCode}
                  </Typography>
                </CardContent>
              </Card>

              {/* Vendor Avatar */}
              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">Vendor Avatar</Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Image
                    src={singleVendor?.avatar?.url || "/images/avatar-placeholder.png"}
                    alt={`${singleVendor?.name || "Vendor"} Avatar`}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                </CardContent>
              </Card>

              {/* Vendor Approval Status */}
              <Card style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography variant="h6">Vendor Approval Status</Typography>
                  <Divider style={{ margin: "10px 0" }} />
                  <Typography variant="body2">
                    <strong>Approved:</strong>{" "}
                    {singleVendor.isApproved ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Blocked:</strong>{" "}
                    {singleVendor.isBlocked ? "Yes" : "No"}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenViewModal(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Vendor Modal */}
      <EditProductModal 
        open={openEditModal}
        onClose={handleEditModalClose}
        data={updatedVendor}
        onInputChange={handleInputChange}
        onSave={handleUpdateVendor}
        isVendorEdit={true} 
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this vendor?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteVendor}
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

export default AllVendorsTable;
