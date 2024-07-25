import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { PrismaClient } from '@prisma/client'
import { auth } from "../../auth"


const bucketName = process.env.AWS_BUCKET_NAME_RAW
const bucketRegion = process.env.AWS_BUCKET_REGION
const identityPoolId = process.env.AWS_IDENTITY_POOL_ID
const transbucket = process.env.AWS_BUCKET_NAME_TRANSFORMED
const projectsKey = 'projects/'


const prisma = new PrismaClient()

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

const client = new S3Client({
  region: bucketRegion,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: bucketRegion },
    identityPoolId: identityPoolId as string,
  }),
})

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
