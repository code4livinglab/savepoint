'use client'

import { Box, Stack, Typography } from '@mui/material'
import { useFormState } from 'react-dom'
import { useState } from 'react'
import { UserMenuIcon } from './UserMenuIcon'
import ProjectSearchList from '../(search)/_components/ProjectSearchList'
import { SearchProjectForm } from '../(search)/_components/SearchProjectForm'
import { action } from '../(search)/action'

export const AppBar = () => {
  const [projectList, formAction] = useFormState(action, [])
  const [diplayList, setDisplaysList] = useState(false)

  const newFormAction = (formData: FormData) => {
    formAction(formData)
    setDisplaysList(true)
  }

  const handleClose = () => {
    setDisplaysList(false)
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{ margin: 3 }}
        className="absolute items-center"
      >
        <Typography variant="h5">savepoint</Typography>
        <SearchProjectForm formAction={newFormAction} />
        {diplayList && projectList.length > 0 && (
          <ProjectSearchList
            projectList={projectList}
            onClose={handleClose}
          />
        )}
      </Stack>
      <Box sx={{ margin: 3 }} className="absolute top-0 right-0">
        <UserMenuIcon />
      </Box>
    </>
  )
}