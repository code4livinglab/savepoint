import React from 'react'
import { AppBar } from '../../projects/_components/AppBar'
import UserProjectList from './UserProjectList'
import { Box } from '@mui/material'

const ProjectLayout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <>
      <AppBar />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <UserProjectList />
      </Box >
    </>
  )
}

export default ProjectLayout
