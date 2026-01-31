"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, CircularProgress } from "@/lib/mui";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
      }}
    >
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
