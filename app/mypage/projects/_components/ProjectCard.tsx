"use client";
import { Project } from "@/app/_types/project";
import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateProjectAction, deleteProjectAction } from "../actions";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: Project;
}

interface FormData {
  name: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: project.name,
      description: project.description,
    },
  });

  const handleCardClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    setDeleteError("");
    setDeleteConfirmName("");
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteError("");
    setDeleteConfirmName("");
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmName !== project.name) {
      setDeleteError("プロジェクト名が一致しません");
      return;
    }

    const result = await deleteProjectAction(project.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setOpen(false);
      setShowDeleteSuccess(true); // 成功通知を表示
      setTimeout(() => {
        router.refresh(); // 画面を更新
      }, 1500); // 通知を表示した後にリフレッシュ
    } else {
      setDeleteError(result.error || "削除中にエラーが発生しました");
    }
  };

  const onSubmit = async (data: FormData) => {
    const result = await updateProjectAction(project.id, data);
    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      console.error(result.error);
    }
  };

  const createdDate = new Date(project.created).toLocaleString();
  const updatedDate = new Date(project.updated).toLocaleString();

  return (
    <>
      {/* 既存のカードとダイアログ部分 */}
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
        style={{ backgroundColor: "white" }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "black", fontWeight: "bold", my: 1 }}
          >
            {project.name}
          </Typography>
          <Typography
            color="text.secondary"
            gutterBottom
            sx={{ color: "gray", my: 1 }}
          >
            {createdDate}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "black", mb: 1 }}
          >
            {project.description.substring(0, 50)}...
          </Typography>
        </CardContent>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, pb: 2 }}
        >
          <SaveAltIcon sx={{ color: "gray" }} />
          <Typography sx={{ color: "gray" }}>999</Typography>
          <FavoriteBorderIcon sx={{ color: "pink" }} />
          <Typography sx={{ color: "pink" }}>999</Typography>
        </Box>
      </Card>

      {/* メインのダイアログ */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: "white",
            borderRadius: 15,
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {project?.name}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: "black" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 編集フォームの内容... */}
            </form>
          ) : (
            <>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                style={{ color: "gray" }}
              >
                タイトル
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                style={{ color: "black" }}
              >
                {project?.name}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 2 }}
                style={{ color: "gray" }}
              >
                概要
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ color: "black" }}
              >
                {project?.description}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 2 }}
                style={{ color: "gray" }}
              >
                作成日
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ color: "black" }}
              >
                {createdDate}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 2 }}
                style={{ color: "gray" }}
              >
                更新日
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ color: "black" }}
              >
                {updatedDate}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  color="primary"
                  onClick={handleEditClick}
                >
                  編集する
                </Button>
                <Button
                  variant="text"
                  fullWidth
                  color="error"
                  onClick={handleDeleteClick}
                >
                  削除する
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: "error.main" }}>
          プロジェクトの削除
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
            このプロジェクトを削除するには、以下にプロジェクト名を入力してください：
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ fontWeight: "bold", my: 2 }}
          >
            {project.name}
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmName}
            onChange={(e) => setDeleteConfirmName(e.target.value)}
            error={!!deleteError}
            helperText={deleteError}
            placeholder="プロジェクト名を入力"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDeleteCancel} color="inherit">
            キャンセル
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteConfirmName !== project.name}
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除成功通知 */}
      <Snackbar
        open={showDeleteSuccess}
        autoHideDuration={3000}
        onClose={() => setShowDeleteSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowDeleteSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          プロジェクトを削除しました
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProjectCard;
