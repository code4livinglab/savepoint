import React from 'react'
import ProjectList from './(list)/_components/ProjectList'
import { SaveProjectButton } from './(list)/_components/SaveProjectButton'
import { AppBar } from './_components/AppBar'

const ProjectLayout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <>
      <ProjectList />
      <AppBar />
      <SaveProjectButton />
      { children }
    </>
  )
}

export default ProjectLayout
