import { Project } from "@/app/_types/project";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const ProjectCard = ({ project }: { project: Project }) => {

  return (
    <>
      <Card key={project.id} sx={{ mb: 2 }} style={{ backgroundColor: "white" }}>
        <CardContent>
          <Typography variant="h5" component="div" style={{ color: "black", fontWeight: 'bold', my: 2 }}>
            {project.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom style={{ color: "gray", my: 2 }}>
            {new Date(project.created).toLocaleString()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton aria-label="save">
              <SaveAltIcon sx={{ color: "gray" }} />
            </IconButton>
            <IconButton aria-label="like">
              <FavoriteBorderIcon sx={{ color: "pink" }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </>
  )
};

export default ProjectCard;