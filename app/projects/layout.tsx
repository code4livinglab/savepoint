import React from 'react'
import ProjectList from './(list)/_components/ProjectList'
import SaveProjectButton from './(list)/_components/SaveProjectButton'
import { StyledAppBar } from './_components/StyledAppBar'

const ProjectLayout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <>
      <StyledAppBar />
      {/* <div className="static">
        <ProjectList />
        <SaveProjectButton />
        { children }
      </div> */}
    </>
  )
}

export default ProjectLayout
