"use client";

import { Box, Typography, Paper } from "@/lib/mui";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        My Profile
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              First Name
            </Typography>
            <Typography variant="body1">{user?.firstName || "-"}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Last Name
            </Typography>
            <Typography variant="body1">{user?.lastName || "-"}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Email
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Account Information
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="body1">{user?.id}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="body1">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
