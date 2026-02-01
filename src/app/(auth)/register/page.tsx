"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@/lib/mui";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues, type RegisterSubmitValues } from "@/lib/schemas";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const submitData: RegisterSubmitValues = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      await registerUser(submitData);
    } catch (err) {
      setFormError("root", {
        message: err instanceof Error ? err.message : "Registration failed",
      });
    }
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
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="First Name"
          type="text"
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          margin="normal"
          autoComplete="given-name"
        />
        <TextField
          fullWidth
          label="Last Name"
          type="text"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          margin="normal"
          autoComplete="family-name"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="normal"
          autoComplete="email"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="normal"
          autoComplete="new-password"
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          margin="normal"
          autoComplete="new-password"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              {...register("acceptedTerms")}
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
        {errors.acceptedTerms && (
          <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
            {errors.acceptedTerms.message}
          </Typography>
        )}
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          size="large"
          loading={isSubmitting}
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
