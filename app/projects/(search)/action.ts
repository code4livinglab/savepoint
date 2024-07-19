'use server'

import { PrismaClient } from '@prisma/client'
import { Project } from '@/app/_types/project'

export const action = async (prevState: any, formData: FormData) => {
  const query = formData.get('query')?.toString() ?? ''

  if (query.length === 0) {
    console.log('プロジェクト名を入力してください')
    return []
  }

  // 検索テキストに該当するプロジェクトの一覧を取得
  const prisma = new PrismaClient()
  const projectList: Project[] = await prisma.$queryRaw`
  SELECT
    id,
    name,
    description,
    embedding::text,
    "teamId",
    created,
    updated
  FROM
    public."Project"
  WHERE
    description LIKE ${'%' + query + '%'}
  `
  
  return projectList
}
