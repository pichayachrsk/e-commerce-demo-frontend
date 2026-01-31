"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  CircularProgress,
  Alert,
} from "@/lib/mui";
import { LoadingButton } from "@mui/lab";
import { useOrder } from "@/hooks/useOrder";
import { useFilters } from "@/hooks/useFilters";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useDeleteOrder } from "@/hooks/useDeleteOrder";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { OrderRow } from "@/components/OrderRow";
import { OrderFilters } from "@/components/OrderFilters";
import { CreateOrderDialog } from "@/components/CreateOrderDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function OrderPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { filters, updateFilters } = useFilters();
  const { data: orders, isLoading, isFetching, error } = useOrder(filters);
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    orderId: string | null;
  }>({ open: false, orderId: null });

  // Form states
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingProvince: "",
    shippingPostalCode: "",
    note: "",
    shippingFee: "",
    status: "pending" as const,
  });

  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, { quantity: number }>
  >({});

  const productMap = useMemo(() => {
    return products.reduce<Record<string, (typeof products)[number]>>(
      (acc, product) => {
        acc[product.id] = product;
        return acc;
      },
      {},
    );
  }, [products]);

  const subtotal = useMemo(() => {
    return Object.entries(selectedProducts).reduce((sum, [productId, item]) => {
      const product = productMap[productId];
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  }, [selectedProducts, productMap]);

  const total = useMemo(
    () => subtotal + parseFloat(formData.shippingFee || "0"),
    [subtotal, formData.shippingFee],
  );

  const hasSelectedProducts = useMemo(
    () => Object.keys(selectedProducts).length > 0,
    [selectedProducts],
  );

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      shippingProvince: "",
      shippingPostalCode: "",
      note: "",
      shippingFee: "0",
      status: "pending",
    });
    setSelectedProducts({});
    setOpenDialog(false);
  }, []);

  const handleCreateOrder = useCallback(() => {
    if (Object.keys(selectedProducts).length === 0) {
      return;
    }
    const items = Object.entries(selectedProducts).map(([productId, item]) => {
      const product = productMap[productId];
      return {
        productId,
        quantity: item.quantity,
        price: product?.price ?? 0,
      };
    });
    const subtotalValue = subtotal;
    const shippingFeeValue = parseFloat(formData.shippingFee || "0");

    createOrder({
      customerId: user?.id || "",
      items,
      shippingAddress: {
        name: formData.shippingName,
        phone: formData.shippingPhone,
        address: formData.shippingAddress,
        province: formData.shippingProvince,
        postalCode: formData.shippingPostalCode,
      },
      status: formData.status,
      shippingFee: shippingFeeValue,
      total: subtotalValue + shippingFeeValue,
      note: formData.note || undefined,
    });
    resetForm();
  }, [
    formData,
    user,
    createOrder,
    resetForm,
    selectedProducts,
    productMap,
    subtotal,
  ]);

  const handleToggleProduct = useCallback(
    (productId: string, checked: boolean) => {
      setSelectedProducts((prev) => {
        const next = { ...prev };
        if (checked) {
          next[productId] = { quantity: prev[productId]?.quantity ?? 1 };
        } else {
          delete next[productId];
        }
        return next;
      });
    },
    [],
  );

  const handleQuantityChange = useCallback(
    (productId: string, delta: number) => {
      setSelectedProducts((prev) => {
        const current = prev[productId];
        if (!current) return prev;
        const nextQty = Math.max(1, current.quantity + delta);
        return { ...prev, [productId]: { quantity: nextQty } };
      });
    },
    [],
  );

  const handleDeleteOrder = useCallback(
    (orderId: string) => {
      deleteOrder(orderId);
      setDeleteConfirm({ open: false, orderId: null });
    },
    [deleteOrder],
  );

  const handleOpenDeleteConfirm = useCallback((orderId: string) => {
    setDeleteConfirm({ open: true, orderId });
  }, []);

  if (isAuthLoading || (isLoading && !orders)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading orders
      </Alert>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {isFetching && !isLoading && (
        <Box sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Orders
        </Typography>
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          loading={isPending}
        >
          Create Order
        </LoadingButton>
      </Box>

      <OrderFilters
        status={filters.status}
        sortOrder={filters.sortOrder}
        onUpdateFilters={updateFilters}
      />

      {orders && orders.length === 0 ? (
        <Paper elevation={1} sx={{ py: 8, px: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              No orders yet
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={1}>
          <List>
            {orders?.map((order: any, index: number) => (
              <OrderRow
                key={order.id}
                order={order}
                isLast={index === orders.length - 1}
                onDelete={handleOpenDeleteConfirm}
                isDeleting={isDeleting}
              />
            ))}
          </List>
        </Paper>
      )}

      <CreateOrderDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        formData={formData}
        onFormChange={handleFormChange}
        products={products}
        isLoadingProducts={isLoadingProducts}
        productsError={productsError}
        selectedProducts={selectedProducts}
        onToggleProduct={handleToggleProduct}
        onQuantityChange={handleQuantityChange}
        subtotal={subtotal}
        total={total}
        onCreateOrder={handleCreateOrder}
        isPending={isPending}
        hasSelectedProducts={hasSelectedProducts}
      />

      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, orderId: null })}
        onConfirm={() =>
          deleteConfirm.orderId && handleDeleteOrder(deleteConfirm.orderId)
        }
        isDeleting={isDeleting}
      />
    </Box>
  );
}
