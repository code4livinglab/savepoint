// app/projects/(list)/loader.ts
import { Project, ProjectRead } from "@/app/_types/project";
import fs from 'fs';
import path from 'path';

export const loader = async () => {
  // JSONファイルのパスを指定
  const filePath = path.join(process.cwd(), 'projects.json'); // Adjust the path as needed
  
  // JSONファイルを読み込む
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const projectReads: ProjectRead[] = JSON.parse(jsonData);

  // ベクトルの形式を変換
  const projects: any = projectReads.map((project) => {
    const stringEmbedding = project.embedding.toString().replace(/[\[\]]/g, '').split(',');
    const embedding = stringEmbedding.map((str) => parseFloat(str));
    return { ...project, embedding };
  });

  console.log(projects[0])
  return projects;
}
