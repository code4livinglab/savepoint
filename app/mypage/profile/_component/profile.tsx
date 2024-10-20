"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { updateUserAction } from "../actions"; // 新しく作成したアクションをインポート

interface UserProfileProps {
  profile: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  if (!profile) {
    return <div>No user information available</div>;
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        color: "#fff",
        backgroundColor: "#1a1a1a",
        padding: "2rem",
        borderRadius: "8px",
        marginTop: "2rem",
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: "1rem" }}>
          ユーザー情報
        </Typography>
      </Box>
      <List
        sx={{ width: "100%", backgroundColor: "#2c2c2c", borderRadius: "8px" }}
      >
        <ListItem divider>
          <ListItemText primary="ユーザーID" secondary={profile.id} />
        </ListItem>
        <ListItem divider>
          <ListItemText primary="ユーザー名" secondary={profile.name} />
        </ListItem>
        <ListItem divider>
          <ListItemText primary="メールアドレス" secondary={profile.email} />
        </ListItem>
      </List>
    </Container>
  );
};

export default UserProfile;
