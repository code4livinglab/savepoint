import { getRole, loader } from './loader'
import ProjectDetails from './_component/ProjectDetails'
import MicroNDA from './_component/MicroNDA'
import { useRadioGroup } from '@mui/material'


const ProjectDetailsPage = async ({
  params,
}: {
  params: { projectId: string },
}) => {
  const project = await loader(params.projectId)
  const userRole = await getRole(params.projectId)

  if(userRole){
    return (
      <ProjectDetails project={project} />
    )
  }else{
      return(
      <MicroNDA project={project}/>
    )
    }
  }

export default ProjectDetailsPage
