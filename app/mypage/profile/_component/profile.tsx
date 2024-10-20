"use client";

import React, { useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateUserAction, deleteUserAction, signOutAction } from "../actions"; // 新しく作成したアクションをインポート

interface UserProfileProps {
  profile: {
    id: string;
    name: string;
    email: string;
  };
}

function UserProfile({ profile }: UserProfileProps) {
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmId, setConfirmId] = useState("");

  if (!profile) {
    return <div>Profile data is not available</div>;
  }

  const handleEdit = (field: keyof typeof editMode) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSave = async (field: keyof typeof editMode) => {
    setEditMode({ ...editMode, [field]: false });

    const formData = new FormData();
    formData.append("name", editedProfile.name);
    formData.append("email", editedProfile.email);

    const result = await updateUserAction(formData);

    if (result.success) {
      setSnackbar({ open: true, message: "プロフィールを更新しました。" });
    } else {
      setSnackbar({
        open: true,
        message: result.error || "更新に失敗しました。",
      });
    }
  };

  const handleDelete = async () => {
    if (confirmId !== profile.id) {
      setSnackbar({
        open: true,
        message: "入力されたIDが正しくありません。",
      });
      return;
    }

    const result = await deleteUserAction(profile.id);

    if (result.success) {
      setSnackbar({ open: true, message: "ユーザーが削除されました。" });
      signOutAction();
    } else {
      setSnackbar({
        open: true,
        message: result.error || "ユーザー削除に失敗しました。",
      });
    }

    setDeleteDialogOpen(false);
    setConfirmId("");
  };

  const handleChange = (field: keyof typeof editMode, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const renderField = (field: "name" | "email", label: string) => (
    <ListItem divider>
      <ListItemText
        primary={label}
        secondary={
          editMode[field] ? (
            <TextField
              value={editedProfile[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              fullWidth
              sx={{ input: { color: "white" } }}
            />
          ) : (
            editedProfile[field]
          )
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label={editMode[field] ? "save" : "edit"}
          onClick={() =>
            editMode[field] ? handleSave(field) : handleEdit(field)
          }
        >
          {editMode[field] ? (
            <SaveIcon sx={{ color: "#fff" }} />
          ) : (
            <EditIcon sx={{ color: "#fff" }} />
          )}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

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
        {renderField("name", "ユーザー名")}
        {/* {renderField("email", "メールアドレス")} */}
      </List>

      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        sx={{ marginTop: "1rem" }}
        onClick={() => setDeleteDialogOpen(true)}
      >
        ユーザー削除
      </Button>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>ユーザー削除確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ユーザーを削除するには、自分のIDを入力してください。
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="ユーザーID"
            fullWidth
            value={confirmId}
            onChange={(e) => setConfirmId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDelete} color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
}

export default UserProfile;
