"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getUserProfile, updateUserProfile } from "../../lib/user"; // 上のバックエンドコードがある場所

interface UserProfile {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

const UserProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const profile = await getUserProfile();
      if (profile) {
        setUserProfile(profile);
        setName(profile.name || "");
        setEmail(profile.email || "");
      } else {
        setError("Failed to fetch user profile");
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdating(true);
    setError(null);
    const updatedProfile = await updateUserProfile({ name, email });
    if (updatedProfile) {
      setUserProfile(updatedProfile);
    } else {
      setError("Failed to update user profile");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5} mb={3} textAlign="center">
        <Typography variant="h4">My Profile</Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box mb={3}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          type="email"
        />
      </Box>
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateProfile}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </Button>
      </Box>
    </Container>
  );
};

export default UserProfilePage;
