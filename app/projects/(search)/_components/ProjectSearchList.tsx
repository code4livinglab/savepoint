import { Project } from '@/app/_types/project'
import { useRouter } from 'next/navigation'
import {
  ButtonGroup,
  Button,
  List,
  ListItemButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { CloseButton } from '../../_components/CloseButton'


const ProjectSearchList = ({
  projectList,
  onClose,
}: {
  projectList: Project[],
  onClose: () => void,
}) => {
  const router = useRouter()

  return (
    <Paper
      elevation={3}
      sx={{ width: 480, height: 720, margin: 3, padding: 2 }}
      className="absolute bottom-0 left-0 overflow-auto"
    >
      <List
        className="overflow-auto"
      >
        {projectList.map((project) => {
          const id = project.id
          const name = project.name

          return (
            <ListItemButton
              key={id}
              alignItems='flex-start'
              divider
              onClick={() => {
                onClose()
                router.push(`/projects/${id}`)
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h6" className="underline">{name}</Typography>
                <Typography variant="body2" className="text-gray-300">{`${project.description.slice(0, 199)}...`}</Typography>
              </Stack>
            </ListItemButton>
          )
        })}
      </List>
      <CloseButton />
    </Paper>
  )
}

export default ProjectSearchList
