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
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateProjectAction } from "../actions";

const ProjectCard = ({ project }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm({
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

  const onSubmit = async (data) => {
    const result = await updateProjectAction(project.id, data);
    if (result.success) {
      setIsEditing(false);
      // プロジェクトデータの更新処理をここに追加
    } else {
      console.error(result.error);
    }
  };

  const createdDate = new Date(project.created).toLocaleString();
  const updatedDate = new Date(project.updated).toLocaleString();

  return (
    <>
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
          }}
          style={{ color: "black", my: 2 }}
          fontWeight="bold"
        >
          {project?.name}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ color: "black" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography
                style={{ color: "gray", marginTop: 2, marginBottom: 1 }}
                variant="subtitle1"
                fontWeight="bold"
              >
                タイトル
              </Typography>
              <TextField
                {...register("name", { required: true })}
                fullWidth
                defaultValue={project.name}
                InputProps={{
                  style: { color: "black" },
                }}
              />

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mt: 2, mb: 1 }}
                style={{ color: "gray" }}
              >
                概要
              </Typography>
              <TextField
                {...register("description", { required: true })}
                fullWidth
                multiline
                rows={4}
                defaultValue={project.description}
                InputProps={{
                  style: { color: "black" },
                }}
              />

              <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                <Button type="submit" variant="contained" color="primary">
                  保存
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  キャンセル
                </Button>
              </Box>
            </form>
          ) : (
            <>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                style={{ color: "gray", my: 2 }}
              >
                タイトル
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                style={{ color: "black", my: 2 }}
              >
                {project?.name}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 2 }}
                style={{ color: "gray", my: 2 }}
              >
                概要
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ color: "black", my: 2 }}
              >
                {project?.description}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 2 }}
                style={{ color: "gray", my: 2 }}
              >
                作成日
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ color: "black", my: 2 }}
              >
                {createdDate}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 2 }}
                style={{ color: "gray", my: 2 }}
              >
                更新日
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                style={{ color: "black", my: 2 }}
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
                <Button variant="text" fullWidth color="error">
                  削除する
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
