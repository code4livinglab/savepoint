import { Project } from "@/types";
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

  const newProjects: Project[] = projects.map((project: any, i: number) => {
    project.embedding = newEmbeddings[i].slice(0, 3)
    return project
  })
  
  return (
    // @ts-ignore
    <Explore projects={newProjects} />
  )
}

export default ProjectList;
