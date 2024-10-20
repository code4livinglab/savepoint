import ProjectCard from './_components/ProjectCard';
import { Project } from "@/app/_types/project";
import { loader } from './loader';
import {
  Box,
  Typography
} from '@mui/material';


const UserProjectList = async () => {
  const projects = await loader();

  return (
    <>
      <Box
        direction="row"
        spacing={3}
        sx={{
          width: 800, mt: 10
        }}
      >
        <Typography variant="h5" sx={{ my: 3, fontWeight: 'bold' }}>プロジェクト一覧</Typography>
        {projects.map((project) => (
          <ProjectCard project={project as Project} />
        ))}
      </Box>
    </>
  );
};

export default UserProjectList;