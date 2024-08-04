import React from 'react'
import ProjectList from './(list)/_components/ProjectList'
import SaveProjectButton from './(list)/_components/SaveProjectButton'
import { StyledAppBar } from './_components/SearchAppBar'
import ProjectSearchBar from './(search)/_components/ProjectSearchBar'

const ProjectLayout = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <div className="static">
      <StyledAppBar />
      <ProjectList />
      {/* <ProjectSearchBar /> */}
      <SaveProjectButton />
      { children }
    </div>
  )
}

export default ProjectLayout
