import { prisma } from '@/src/prisma'
import { auth } from "../../../auth"

export const getRole = async (projectId: string) => {
  // セッションの取得
  const session = await auth()
  if (!session || !session.user) {
    console.error('No session')
    return null
  }

  // ユーザーがAdminの場合にアクセス権限を付与
  const userId = session.user.id ?? null
  if (userId === 'admin') {
    return 'OWNER'
  }

  if (!userId) {
    console.error('No user id')
    return null
  }

  try {
    const user = await prisma.projectUser.findUnique({
      where: { userId_projectId: { userId, projectId } },
    })
    return user?.role
  } catch (error) {
    console.error('Error retrieving user role:', error)
    return null
  }
}

export const getSessionUserId = async () => {
  const session = await auth()

  if (!session?.user?.id) return null

  return session.user.id
}

export const loader = async (id: string) => {
  try {
    const projects: any = await prisma.$queryRaw`
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
  id = ${id}
`
    return projects[0] ?? []
  } catch (error) {
    console.error('Error loading project:', error)
    return []
  }
}

export const similarProjectsLoader = async (project: any, limit: number) => {
  const similarProjects = await prisma.$queryRaw`
SELECT
  id,
  name,
  description,
  1 - (embedding <=> ${project.embedding}::vector) AS similarity
FROM
  public."Project"
WHERE
  id != ${project.id}
ORDER BY
  similarity DESC
LIMIT
  ${limit}
`

  return similarProjects
}
