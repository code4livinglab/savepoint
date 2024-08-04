"use client";

import Link from "next/link";
import {
  Alert,
  Box,
  Link as MUILink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignUpFormButton } from "./SignUpFormButton";
import { signUpAction } from "./action";

const initialState = {
  error: null,
  success: false,
};

const SignUpForm = () => {
  const [state, formAction] = useFormState(signUpAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/");
    }
  }, [state.success, router]);

  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Paper elevation={3} className="space-y-4 p-6 max-w-md w-full rounded-lg">
        <Typography
          variant="h3"
          className="text-center font-bold mb-4"
        >
          SAVEPOINT
        </Typography>
        {state.error && (
          <Alert severity="error" className="mb-4">
            {state.error}
          </Alert>
        )}
        <Box component="form" action={formAction} className="space-y-4">
          <TextField
            label="User ID"
            name="id"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Username"
            name="username"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Confirm Password"
            name="password2"
            type="password"
            fullWidth
            variant="outlined"
          />
          <SignUpFormButton />
        </Box>
        <Typography variant="body2" className="text-center mt-4">
          すでにアカウントをお持ちですか？{" "}
          <MUILink
            component={Link}
            href="/users/sign-in"
            sx={{ color: 'primary.main' }}
          >
            Sign inはこちら
          </MUILink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUpForm;
