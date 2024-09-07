'use client'

import { BugReport } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
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

  const handleBugReportOpen = () => {
    window.open(process.env.BUG_REPORT_URL)
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{ width: 480, margin: 3 }}
        className="absolute items-center"
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
      {/* Report Bugs */}
      <Box sx={{ margin: 3 }} className="absolute top-0 right-0">
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleBugReportOpen}
          sx={{ width: 56, height: 56, margin: 0 }}
        >
          <BugReport />
        </IconButton>

        {/* User Menu */}
        <UserMenuIcon />
      </Box>
    </>
  )
}
