import { getRole, loader } from './loader'
import ProjectDetails from './_component/ProjectDetails'

const ProjectDetailsPage = async ({
  params,
}: {
  params: { projectId: string },
}) => {
  const project = await loader(params.projectId)
  const userRole = await getRole(params.projectId) ?? ''

  return (
    <ProjectDetails project={project} userRole={userRole} />
  )
}

export default ProjectDetailsPage
