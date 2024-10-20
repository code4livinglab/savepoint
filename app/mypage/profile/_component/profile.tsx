"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
// import { userInfoLoader } from "./loader";

interface UserProfileProps {
  id: string;
  name: string;
  email: string;
  password: string;
}

function UserProfile({ profile }: UserProfileProps) {
  if (!profile) {
    return <div>Profile data is not available</div>;
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
      <List
        sx={{ width: "100%", backgroundColor: "#2c2c2c", borderRadius: "8px" }}
      >
        {/* タイトルとしてユーザー情報 */}
        <ListItem>
          <ListItemText
            primary="ユーザー情報"
            primaryTypographyProps={{ variant: "h6" }}
          />
        </ListItem>
        <ListItem divider>
          <ListItemText primary="ユーザーID" secondary={profile.id} />
        </ListItem>
        <ListItem divider>
          <ListItemText primary="ユーザー名" secondary={profile.name} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit">
              <EditIcon sx={{ color: "#fff" }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem divider>
          <ListItemText primary="メールアドレス" secondary={profile.email} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit">
              <EditIcon sx={{ color: "#fff" }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {/* <ListItem>
          <ListItemText primary="パスワード" secondary={profile.password} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit">
              <EditIcon sx={{ color: "#fff" }} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem> */}
      </List>

      <Box textAlign="right" mt={4}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ backgroundColor: "#6200ea" }}
        >
          セーブ
        </Button>
      </Box>
    </Container>
  );
}

export default UserProfile;
