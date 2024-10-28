'use client'

import { useRouter } from 'next/navigation'
import {
  Box,
  LinearProgress,
  List,
  ListItemButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { CloseButton } from '../../_components/CloseButton'

type SimilarProject = {
  id: string
  name: string
  description: string
  similarity: number
}

export const RecommendedProjects = ({
  similarProjects
}: {
  similarProjects: SimilarProject[]
}) => {
  const router = useRouter()

  return (
    <Paper
      elevation={3}
      sx={{ width: 480, height: 720, margin: 3, padding: 2 }}
      className="absolute bottom-0 right-0 overflow-auto"
    >
      <Typography variant="h6">似ているプロジェクト</Typography>
      <List>
        {similarProjects.map((project) => {
          const id = project.id
          const name = project.name
          const similarity = project.similarity * 100

          return (
            <ListItemButton
              key={id}
              alignItems='flex-start'
              divider
              onClick={() => {
                router.push(`/projects/${id}`)
              }}
            >
              <Stack spacing={1} className="w-full p-2">
                <Typography className="text-gray-300">{name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={similarity} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >{similarity.toFixed()}%</Typography>
                  </Box>
                </Box>
              </Stack>
            </ListItemButton>
          )
        })}
      </List>
      <CloseButton />
    </Paper>
  )
}
