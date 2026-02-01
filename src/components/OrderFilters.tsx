"use client";

import { memo } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@/lib/mui";
import { STATUS_OPTIONS } from "@/lib/types";

type OrderFiltersProps = {
  status?: string;
  sortOrder?: string;
  onUpdateFilters: (filters: {
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => void;
};

export const OrderFilters = memo(function OrderFilters({
  status,
  sortOrder,
  onUpdateFilters,
}: OrderFiltersProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 3,
      }}
    >
      <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status || ""}
          label="Status"
          onChange={(e) =>
            onUpdateFilters({ status: e.target.value || undefined })
          }
        >
          <MenuItem value="">All Status</MenuItem>
          {STATUS_OPTIONS.map((statusOption) => (
            <MenuItem key={statusOption} value={statusOption}>
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
        <InputLabel>Sort By Price</InputLabel>
        <Select
          value={sortOrder || ""}
          label="Sort By"
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              onUpdateFilters({ sortBy: "total", sortOrder: value });
            } else {
              onUpdateFilters({ sortBy: undefined, sortOrder: undefined });
            }
          }}
        >
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="asc">Price: Low to High</MenuItem>
          <MenuItem value="desc">Price: High to Low</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
        <InputLabel>Sort By Date</InputLabel>
        <Select
          value={sortOrder || ""}
          label="Sort By"
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              onUpdateFilters({ sortBy: "createdAt", sortOrder: value });
            } else {
              onUpdateFilters({ sortBy: undefined, sortOrder: undefined });
            }
          }}
        >
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="asc">Date: Oldest to Newest</MenuItem>
          <MenuItem value="desc">Date: Newest to Oldest</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
});
