import { Project } from "@/app/_types/project";
import Explore from "./Explore";
import { pca } from "../_lib/pca";
import { loader } from "../loader";

const ProjectList = async () => {
  const projects = await loader();
  if (projects.length < 1) {
    return <></>;
  }
  const embeddings = projects.map((project) => project.embedding);
  const newEmbeddings = pca(embeddings);

  const newProjects: Project[] = projects.map((project: any, i: number) => {
    project.embedding = newEmbeddings[i].slice(0, 3);
    return project;
  });

  return <Explore projects={newProjects} />;
};

export default ProjectList;
