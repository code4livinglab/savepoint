import {
  Paper,
  Stack,
  TextField,
} from '@mui/material'
// import { File } from '@/app/_types/file'
import { Project } from '@/app/_types/project'
import { DownloadButton } from './DownloadButton'
import { MarkdownViewer } from './MarkdownViewer'
import { CloseButton } from '../../_components/CloseButton';

export const ProjectDetails = ({
  project,
}: {
  project: Project,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{ width: 480, height: 720, margin: 3, padding: 2 }}
      className="absolute bottom-0 left-0 overflow-auto"
    >
      <Stack spacing={2}>
        <MarkdownViewer project={project} />
        {/* {project.file_names && project.file_names?.length > 0 && (
          <>
            <h2 className="text-xl text-gray-200 font-semibold my-3">Data</h2>
            {project.file_names.map((filename, i) => (
              <button key={i}
                className="text-left text-gray-300 my-1 hover:text-blue-300 hover:underline"
                onClick={()=> viewProjectFile(project.id, filename)}
              >
                ・{filename}
              </button>
            ))}
          </>
        )} */}
        <DownloadButton projectId={project.id} />
        <CloseButton />
      </Stack>
    </Paper>
  )
}

const viewProjectFile = async (projectId: string, fileName: string) => {
  try {
    const response = await fetch(`/api/${projectId}/files/${fileName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const href = data.url;

    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("viewfile error:", err);
  }
};
