'use server'

import { Project } from '@/app/_types/project'
import { prisma } from '@/app/prisma'

export const action = async (prevState: any, formData: FormData) => {
  const query = formData.get('query')?.toString() ?? ''

  if (query.length === 0) {
    console.log('プロジェクト名を入力してください')
    return []
  }

  // 検索テキストに該当するプロジェクトの一覧を取得
  const projectList: Project[] = await prisma.$queryRaw`
  SELECT
    id,
    name,
    description,
    embedding::text,
    created,
    updated
  FROM
    public."Project"
  WHERE
    description LIKE ${'%' + query + '%'}
  `
  
  return projectList
}
