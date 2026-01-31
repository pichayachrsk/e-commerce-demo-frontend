"use client";

import { memo, useCallback } from "react";
import { Box, Typography, ListItem, ListItemText, Chip } from "@/lib/mui";
import { LoadingButton } from "@mui/lab";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Order } from "@/lib/types";

const STATUS_COLORS: Record<string, any> = {
  delivered: "success",
  cancelled: "error",
  shipped: "info",
  pending: "warning",
  processing: "warning",
};

type OrderRowProps = {
  order: Order;
  isLast: boolean;
  onDelete: (orderId: string) => void;
  isDeleting: boolean;
};

export const OrderRow = memo(function OrderRow({
  order,
  isLast,
  onDelete,
  isDeleting,
}: OrderRowProps) {
  const handleDelete = useCallback(() => {
    onDelete(order.id);
  }, [onDelete, order.id]);

  const itemsSummary = Array.isArray(order.items) ? order.items : [];

  return (
    <ListItem
      divider={!isLast}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <ListItemText
        disableTypography
        primary={
          <Box component="div">
            <Typography variant="body1" fontWeight="medium" component="div">
              Order #{order.id}
            </Typography>
            <Typography variant="body2" component="div">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" component="div">
              Total: ${order.total}
            </Typography>
            {itemsSummary.length > 0 && (
              <Box
                component="div"
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                {itemsSummary.map((item) => (
                  <Typography
                    key={item.id || `${item.productId}-${item.quantity}`}
                    variant="body2"
                    color="text.secondary"
                    component="div"
                  >
                    {item.product?.name} x {item.quantity} · ${item.price}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        }
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Chip
          label={order.status}
          color={STATUS_COLORS[order.status] as any}
          size="small"
        />
        <LoadingButton
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          loading={isDeleting}
          sx={{ minWidth: 40 }}
        />
      </Box>
    </ListItem>
  );
});
