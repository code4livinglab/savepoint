'use server'

import { Project } from '@/types'
import { prisma } from '@/prisma'

export const action = async (prevState: any, formData: FormData) => {
  const query = formData.get('query')?.toString() ?? ''

  if (query.length === 0) {
    console.log('プロジェクト名を入力してください')
    return []
  }

  try {
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

  } catch (error) {
    console.error({ error })
    return [] 
  }
}
