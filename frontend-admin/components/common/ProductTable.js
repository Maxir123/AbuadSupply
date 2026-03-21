import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const ProductTable = ({ rows, columns }) => {
  return (
    <div style={{ height: "calc(100vh - 200px)", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={60}
        disableSelectionOnClick
        pageSizeOptions={[5, 10, 20, 100]}
        rowsPerPageOptions={[5, 10, 20]}
        className="data-grid"
        style={{ overflowX: "auto" }} 
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ADD8E6", 
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            fontSize: ".9rem", 
          },
        }}
      />
    </div>
  );
};

export default ProductTable;
