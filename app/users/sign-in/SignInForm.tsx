"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import {
  Alert,
  Box,
  Link as MUILink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { SignInFormButton } from "./SignInFormButton";
import { signInAction } from "./action";

const initialState = {
  error: null,
  success: false,
};

const SignInForm = () => {
  const [state, formAction] = useFormState(signInAction, initialState);

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
          <MUILink
            component={Link}
            href="/users/sign-up"
            sx={{ color: 'info.main' }}
          >
            Sign upはこちら
          </MUILink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignInForm;
