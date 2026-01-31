"use client";

import { memo } from "react";
import { Box, Typography, Dialog } from "@/lib/mui";
import { LoadingButton } from "@mui/lab";

type DeleteConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export const DeleteConfirmDialog = memo(function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Delete Order
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Are you sure you want to delete this order?
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <LoadingButton variant="outlined" onClick={onClose}>
            Cancel
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="error"
            onClick={onConfirm}
            loading={isDeleting}
          >
            Delete
          </LoadingButton>
        </Box>
      </Box>
    </Dialog>
  );
});
