import { Project, ProjectRead } from "@/app/_types/project"
import { prisma } from "@/app/prisma"

export const loader = async () => {
  // 検索テキストに該当するプロジェクトの一覧を取得
  const projectReads: ProjectRead[] = await prisma.$queryRaw`
SELECT
  id,
  name,
  description,
  embedding::text,
  created,
  updated
FROM
  public."Project"
`
      
  // ベクトルの形式を変換
  const projects: Project[] = projectReads.map((project) => {
    const stringEmbedding = project.embedding.toString().replace(/[\[\]]/g, '').split(',')
    const embedding = stringEmbedding.map((str) => parseFloat(str))
    return { ...project, embedding }
  })

  return projects
}
