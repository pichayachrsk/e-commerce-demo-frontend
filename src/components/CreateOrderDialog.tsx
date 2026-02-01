"use client";

import { memo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  TextField,
  Paper,
  List,
  CircularProgress,
  Alert,
} from "@/lib/mui";
import { LoadingButton } from "@mui/lab";
import { ProductRow } from "./ProductRow";
import { Product, STATUS_OPTIONS } from "@/lib/types";

type CreateOrderDialogProps = {
  open: boolean;
  onClose: () => void;
  formData: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingProvince: string;
    shippingPostalCode: string;
    note: string;
    shippingFee: string;
    status: string;
  };
  onFormChange: (field: string, value: string) => void;
  products: Product[];
  isLoadingProducts: boolean;
  productsError: any;
  selectedProducts: Record<string, { quantity: number }>;
  onToggleProduct: (productId: string, checked: boolean) => void;
  onQuantityChange: (productId: string, delta: number) => void;
  subtotal: number;
  total: number;
  onCreateOrder: () => void;
  isPending: boolean;
  hasSelectedProducts: boolean;
};

export const CreateOrderDialog = memo(function CreateOrderDialog({
  open,
  onClose,
  formData,
  onFormChange,
  products,
  isLoadingProducts,
  productsError,
  selectedProducts,
  onToggleProduct,
  onQuantityChange,
  subtotal,
  total,
  onCreateOrder,
  isPending,
  hasSelectedProducts,
}: CreateOrderDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Create New Order
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Recipient Name"
            value={formData.shippingName}
            onChange={(e) => onFormChange("shippingName", e.target.value)}
          />
          <TextField
            label="Phone"
            value={formData.shippingPhone}
            onChange={(e) => onFormChange("shippingPhone", e.target.value)}
          />
          <TextField
            label="Address"
            value={formData.shippingAddress}
            onChange={(e) => onFormChange("shippingAddress", e.target.value)}
            multiline
            minRows={2}
          />
          <TextField
            label="Province"
            value={formData.shippingProvince}
            onChange={(e) => onFormChange("shippingProvince", e.target.value)}
          />
          <TextField
            label="Postal Code"
            value={formData.shippingPostalCode}
            onChange={(e) => onFormChange("shippingPostalCode", e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => onFormChange("status", e.target.value as string)}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Products
            </Typography>
            {isLoadingProducts ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : productsError ? (
              <Alert severity="error">Error loading products</Alert>
            ) : products.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No products available
              </Typography>
            ) : (
              <Paper
                variant="outlined"
                sx={{ maxHeight: 240, overflow: "auto" }}
              >
                <List dense>
                  {products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      isChecked={Boolean(selectedProducts[product.id])}
                      quantity={selectedProducts[product.id]?.quantity ?? 1}
                      onToggleProduct={onToggleProduct}
                      onQuantityChange={onQuantityChange}
                    />
                  ))}
                </List>
              </Paper>
            )}
          </Box>
          <TextField
            label="Shipping Fee"
            type="number"
            value={formData.shippingFee}
            onChange={(e) =>
              onFormChange("shippingFee", e.target.value.replace(/[^\d.]/g, ""))
            }
          />
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Subtotal: ${subtotal.toFixed(2)}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              Total: ${total.toFixed(2)}
            </Typography>
          </Box>
          <TextField
            label="Note"
            value={formData.note}
            onChange={(e) => onFormChange("note", e.target.value)}
            multiline
            minRows={2}
          />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <LoadingButton variant="outlined" onClick={onClose}>
              Cancel
            </LoadingButton>
            <LoadingButton
              variant="contained"
              onClick={onCreateOrder}
              loading={isPending}
              disabled={!hasSelectedProducts}
            >
              Create
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
});
