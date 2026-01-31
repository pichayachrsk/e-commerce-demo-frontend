"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useAuth } from "./useAuth";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const filters = useMemo(() => {
    const customerId = !isLoading ? user?.id || undefined : undefined;

    return {
      customerId,
      status: searchParams.get("status") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10,
      search: searchParams.get("search") || undefined,
    };
  }, [isLoading, user?.id, searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
