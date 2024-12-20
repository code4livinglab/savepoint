"use client";

import Link from "next/link";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Link as MUILink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormState } from "react-dom";
import { SignUpFormButton } from "./SignUpFormButton";
import { signUpAction } from "./action";

const initialState = {
  error: null,
  success: false,
};

const SignUpForm = () => {
  const [state, formAction] = useFormState(signUpAction, initialState);

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
          <FormControlLabel
            control={<Checkbox name="agreement" />}
            label={
              <>
                <MUILink
                  component={Link}
                  href="https://ludicrous-flyingfish-cc4.notion.site/terms-of-use"
                  target="_blank"
                  sx={{ color: 'info.main' }}
                >
                  利用規約
                </MUILink>
                と
                <MUILink
                  component={Link}
                  href="http://ludicrous-flyingfish-cc4.notion.site/privacy-policy"
                  target="_blank"
                  sx={{ color: 'info.main' }}
                >
                  プライバシーポリシー
                </MUILink>
                に同意する。
              </>
            }
          />
          <SignUpFormButton />
        </Box>
        <Typography variant="body2" className="text-center mt-4">
          すでにアカウントをお持ちですか？{" "}
          <MUILink
            component={Link}
            href="/users/sign-in"
            sx={{ color: 'info.main' }}
          >
            Sign inはこちら
          </MUILink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUpForm;
