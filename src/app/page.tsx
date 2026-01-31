"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@/lib/mui";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = user
    ? [
        { label: "Orders", href: "/order", variant: "text" as const },
        { label: "Profile", href: "/profile", variant: "text" as const },
      ]
    : [
        { label: "Login", href: "/login", variant: "text" as const },
        { label: "Register", href: "/register", variant: "contained" as const },
      ];

  const heroActions = user
    ? [
        {
          label: "View My Orders",
          href: "/order",
          variant: "contained" as const,
        },
      ]
    : [
        {
          label: "Get Started",
          href: "/register",
          variant: "contained" as const,
        },
        { label: "Login", href: "/login", variant: "outlined" as const },
      ];

  const features = [
    {
      title: "Easy Shopping",
      description: "Browse and shop from thousands of products with ease.",
    },
    {
      title: "Secure Payment",
      description: "Your transactions are safe and secure with us.",
    },
    {
      title: "Fast Delivery",
      description: "Get your orders delivered quickly to your doorstep.",
    },
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
          <Button
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            ☰
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* Demo */}
          </Typography>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {navLinks.map((action) => (
              <Button
                key={action.label}
                color="inherit"
                variant={action.variant}
                component={Link}
                href={action.href}
              >
                {action.label}
              </Button>
            ))}
            {user && (
              <Button color="inherit" variant="outlined" onClick={logout}>
                Logout
              </Button>
            )}
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
            {navLinks.map((item) => (
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
            {user && (
              <ListItem disablePadding>
                <Button
                  fullWidth
                  onClick={logout}
                  sx={{
                    justifyContent: "flex-start",
                    px: 2,
                    py: 1,
                    color: "inherit",
                    textTransform: "none",
                  }}
                >
                  <ListItemText primary="Logout" />
                </Button>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ fontSize: { xs: "2.5rem", md: "3.75rem" } }}
          >
            Welcome to Our Store
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: "md", mx: "auto", mb: 4 }}
          >
            Discover amazing products and great deals. Shop with confidence.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {heroActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                size="large"
                component={Link}
                href={action.href}
                sx={{ px: 4, py: 1.5 }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map(({ title, description }) => (
            <Box key={title} sx={{ display: "flex" }}>
              <Card elevation={2} sx={{ height: "100%", width: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    fontWeight="medium"
                  >
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{ bgcolor: "background.paper", py: 4, mt: 8 }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} E-Commerce Demo. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
