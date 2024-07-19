import { Project } from '@/app/_types/project'
import Explore from './Explore'
import { pca } from '../_lib/pca'
import { loader } from '../loader'


const ProjectList = async () => {
  const projects = await loader()
  const embeddings = projects.map((project) => project.embedding)
  const newEmbeddings = pca(embeddings)
  const newProjects: Project[] = projects.map((project: any, i: number) => {
    project.embedding = newEmbeddings[i].slice(0, 3)
    return project
  })
  
  return (
    <div className="overflow-hidden">
      <Explore projects={newProjects} />
    </div>
  )
}

export default ProjectList
