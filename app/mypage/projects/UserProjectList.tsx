import ProjectCard from "./_components/ProjectCard";
import { Project } from "@/app/_types/project";
import { loader } from "./loader";
import { Box, Typography, Stack } from "@mui/material";

const UserProjectList = async () => {
  const projects = await loader();

  return (
    <>
      <Box
        sx={{
          width: 800,
          mt: 10,
        }}
      >
        <Typography variant="h5" sx={{ my: 3, fontWeight: "bold" }}>
          プロジェクト一覧
        </Typography>
        <Stack spacing={3}>
          {projects.map(
            (project) =>
              project && (
                <ProjectCard key={project.id} project={project as Project} />
              )
          )}
        </Stack>
      </Box>
    </>
  );
};

export default UserProjectList;
