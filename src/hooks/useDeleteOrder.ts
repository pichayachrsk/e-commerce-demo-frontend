"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      try {
        const response = await api.delete(`/orders/${orderId}`);
        return response;
      } catch (error) {
        console.error("Delete error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
    },
  });
}
