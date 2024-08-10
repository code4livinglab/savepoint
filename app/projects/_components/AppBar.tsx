'use client'

import { Box, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import { useState } from 'react'
import { UserMenuIcon } from './UserMenuIcon'
import ProjectSearchList from '../(search)/_components/ProjectSearchList'
import { SearchProjectForm } from '../(search)/_components/SearchProjectForm'
import { action } from '../(search)/action'

export const AppBar = () => {
  const [projectList, formAction] = useFormState(action, [])
  const [displayList, setDisplayList] = useState(false)
  const router = useRouter()

  const newFormAction = (formData: FormData) => {
    formAction(formData)
    router.push('/projects')
    setDisplayList(true)
  }

  const handleClose = () => {
    setDisplayList(false)
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{ width: 480, margin: 3 }}
        className="absolute top-0 left-0 items-center"
      >
        <Link href="/projects">
          <Typography variant="h5">savepoint</Typography>
        </Link>
        <SearchProjectForm formAction={newFormAction} />
      </Stack>
      {displayList && projectList.length > 0 && (
        <ProjectSearchList
          projectList={projectList}
          onClose={handleClose}
        />
      )}
      <Box sx={{ margin: 3 }} className="absolute top-0 right-0">
        <UserMenuIcon />
      </Box>
    </>
  )
}
