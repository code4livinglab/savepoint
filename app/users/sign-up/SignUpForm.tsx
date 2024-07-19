"use client";

import Link from "next/link";
import { signUpAction } from "./action";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <Box className="flex items-center justify-center min-h-screen bg-gray-100">
      <Box className="space-y-4 p-6 max-w-md w-full bg-white shadow-md rounded-lg">
        <Typography
          variant="h3"
          className="text-center font-bold mb-4 text-black"
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className="bg-blue-500 hover:bg-blue-700 text-white"
          >
            Sign up
          </Button>
        </Box>
        <Typography variant="body2" className="text-center mt-4">
          すでにアカウントをお持ちですか？{" "}
          <Link href="/users/sign-in" className="text-blue-500 hover:underline">
            Sign inはこちら
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpForm;
