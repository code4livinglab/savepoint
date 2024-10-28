import { loader, similarProjectsLoader } from './loader'
import { ProjectDetails } from './_component/ProjectDetails'
import { RecommendedProjects } from './_component/RecommendedProjects'

const ProjectDetailsPage = async ({
  params,
}: {
  params: { projectId: string },
}) => {
  const project = await loader(params.projectId)
  const similarProjects = await similarProjectsLoader(project, 20)
  
  return (
    <>
      <ProjectDetails project={project} />
      {/* @ts-ignore */}
      <RecommendedProjects similarProjects={similarProjects} />
    </>
  )
}

export default ProjectDetailsPage
