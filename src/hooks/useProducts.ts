"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<any>("/products");
      const payload = <Product[]>response.data;

      return payload;
    },
  });
}
