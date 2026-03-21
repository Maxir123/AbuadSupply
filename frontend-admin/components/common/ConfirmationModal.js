import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirmation-modal">
      <DialogTitle id="confirmation-modal">{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={onConfirm} color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
