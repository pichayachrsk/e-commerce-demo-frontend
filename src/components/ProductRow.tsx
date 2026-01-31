"use client";

import { memo, useCallback, type ChangeEvent } from "react";
import {
  Box,
  Typography,
  Button,
  ListItem,
  ListItemText,
  Checkbox,
} from "@/lib/mui";

type ProductRowProps = {
  product: { id: string; name: string; price: number };
  isChecked: boolean;
  quantity: number;
  onToggleProduct: (productId: string, checked: boolean) => void;
  onQuantityChange: (productId: string, delta: number) => void;
};

export const ProductRow = memo(function ProductRow({
  product,
  isChecked,
  quantity,
  onToggleProduct,
  onQuantityChange,
}: ProductRowProps) {
  const handleToggle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onToggleProduct(product.id, event.target.checked);
    },
    [onToggleProduct, product.id],
  );

  const handleDecrease = useCallback(() => {
    onQuantityChange(product.id, -1);
  }, [onQuantityChange, product.id]);

  const handleIncrease = useCallback(() => {
    onQuantityChange(product.id, 1);
  }, [onQuantityChange, product.id]);

  return (
    <ListItem
      divider
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        py: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: { xs: 2, sm: 0 },
        }}
      >
        <Checkbox checked={isChecked} onChange={handleToggle} sx={{ ml: -1 }} />
        <ListItemText
          primary={product.name}
          secondary={`$${product.price.toFixed(2)}`}
          slotProps={{
            primary: {
              noWrap: true,
              title: product.name,
              sx: {
                fontWeight: 500,
                display: "block",
              },
            },
            secondary: {
              noWrap: true,
            },
          }}
          sx={{
            minWidth: 0,
            "& .MuiListItemText-primary": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          ml: { xs: 5, sm: "auto" },
          mt: { xs: -1, sm: 0 },
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleDecrease}
          disabled={!isChecked || quantity <= 1}
          sx={{ minWidth: 32, p: 0.5 }}
        >
          -
        </Button>
        <Typography
          variant="body2"
          sx={{ minWidth: 24, textAlign: "center", fontWeight: "bold" }}
        >
          {quantity}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleIncrease}
          disabled={!isChecked}
          sx={{ minWidth: 32, p: 0.5 }}
        >
          +
        </Button>
      </Box>
    </ListItem>
  );
});
