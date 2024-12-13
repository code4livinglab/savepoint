import { kmeans } from 'ml-kmeans'
import { Project } from "@/app/_types/project";
import Explore from "./Explore";
import { pca } from "../_lib/pca";
import { loader } from "../loader";

const ProjectList = async () => {
  const projects = await loader();
  if (!projects) {
    return null;
  }

  const embeddings = projects.map((project) => project.embedding);
  const newEmbeddings = pca(embeddings);

  const data: number[][] = projects.map((project: any, i: number) => {
    return newEmbeddings[i].slice(0, 3)
  })
  
  const clusters = kmeans(data, 6, {
    initialization: [
      [-50, 0, 0],
      [-50, -50, 50],
      [-50, 50, -50],
      [50, 0, 0],
      [50, -50, 50],
      [50, 50, -50],
    ]
  }).clusters;

  const newProjects: Project[] = projects.map((project: any, i: number) => {
    project.embedding = newEmbeddings[i].slice(0, 3)
    project.cluster = clusters[i]
    return project
  })
  
  return (
    // @ts-ignore
    <Explore projects={newProjects}/>
  )
}

export default ProjectList;
