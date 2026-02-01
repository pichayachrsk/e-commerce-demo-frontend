"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@/lib/mui";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
    { label: "Orders", href: "/order" },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            ☰
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: { xs: 1, sm: 0 }, mr: { sm: 4 } }}
          >
            {/* Demo */}
          </Typography>
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, gap: 3, flexGrow: 1 }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={Link}
                href={item.href}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              {user?.email}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            Demo
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <Link
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  <ListItemText primary={item.label} sx={{ px: 2, py: 1 }} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
