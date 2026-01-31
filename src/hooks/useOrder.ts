"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mockOrders } from "@/lib/mockData";
import type { Order } from "@/lib/types";

interface OrderFilters {
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
  customerId?: string;
}

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export function useOrder(filters?: OrderFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.customerId) params.append("customerId", filters.customerId);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters?.page) params.append("cursor", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const response = await api.get<{ data: [] }>(
        `/orders?${params.toString()}`,
      );
      return <Order[]>response.data.data;
    },
  });
}
