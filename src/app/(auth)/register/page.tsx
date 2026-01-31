"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Alert,
  LoadingButton,
  Checkbox,
  FormControlLabel,
} from "@/lib/mui";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions");
      return;
    }

    await register({ firstName, lastName, email, password });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        fontWeight="bold"
      >
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          margin="normal"
          autoComplete="given-name"
        />
        <TextField
          fullWidth
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          margin="normal"
          autoComplete="family-name"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          autoComplete="email"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
          autoComplete="new-password"
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          margin="normal"
          autoComplete="new-password"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I accept the{" "}
              <Link
                href="/terms"
                style={{ color: "#2563eb", textDecoration: "none" }}
              >
                Terms and Conditions
              </Link>
            </Typography>
          }
          sx={{ mt: 1 }}
        />
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          size="large"
        >
          Register
        </LoadingButton>
      </Box>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "#2563eb", textDecoration: "none" }}
        >
          Login
        </Link>
      </Typography>
    </Paper>
  );
}
