"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TextField, Box, Typography, Alert } from "@mui/material";
import { SignInFormButton } from "./SignInFormButton";
import { signInAction } from "./action";

const initialState = {
  error: null,
  success: false,
};

const SignInForm = () => {
  const [state, formAction] = useFormState(signInAction, initialState);
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
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            required
          />
          <SignInFormButton />
        </Box>
        <Typography variant="body2" className="text-center mt-4">
          アカウントをお持ちでないですか？{" "}
          <Link href="/users/sign-up" className="text-blue-500 hover:underline">
            Sign upはこちら
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignInForm;
