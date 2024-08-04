import { loader } from './loader'
import { ProjectDetails } from './_component/ProjectDetails'

const ProjectDetailsPage = async ({
  params,
}: {
  params: { projectId: string },
}) => {
  const project = await loader(params.projectId)
  
  return (
    <ProjectDetails project={project} />
  )
}

export default ProjectDetailsPage
