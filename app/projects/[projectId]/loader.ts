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
  const session = await auth()

  if (!session?.user?.id) return null

  const userId = session.user.id

  try {
    const user = await prisma.projectUser.findUnique({
      where: { userId_projectId: { userId, projectId } },
    })
    return user?.userId
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
const prisma = new PrismaClient()

export const loader = async (id: string) => {
  try {
    const projects: any = await prisma.$queryRaw`
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
      id = ${id}
    `
    return projects[0] ?? []
  } catch (error) {
    console.error('Error loading project:', error)
    return []
  }
}

export const loader = async (id: string) => {
  const prisma = new PrismaClient()
  const projects: any = await prisma.$queryRaw`
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
  id = ${id}
`

  return projects[0] ?? []
}

const  getFile = async (projectId: string, fileName: string) => {
  const projectUri = projectsKey + projectId + '/';
  const listParams = {
    Bucket: transbucket,
    Prefix: projectUri,
    Delimiter: '/'
  };
  const listVersion = await client.send(new ListObjectsV2Command(listParams));
  const folders = listVersion.CommonPrefixes?.map(prefix => prefix.Prefix);

  const latestVersion = folders?.map(folder => folder?.split('/')[2])
    .filter(folder => !isNaN(Number(folder)))
    .sort((a, b) => Number(b) - Number(a))[0];

  const fileKey = projectUri + latestVersion + '/' + fileName;
  const data = await client.send(new ListObjectsV2Command({ Bucket: transbucket, Prefix: fileKey }));

  if (data.Contents?.length && data.Contents.length > 0) {
    const href = `https://${transbucket}.s3.${bucketRegion}.amazonaws.com/${fileKey}`;
    return Response.json({ url: href })
  }
}

export const downloadLoader = async (projectId: string) => {
  const projectUri = projectsKey + projectId;
  const filesData = await client.send(new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: projectUri,
  }))

  const filePromises = filesData.Contents?.map(async file => {
    const fileData = await client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: file.Key
    }))

    if (fileData.Body) {
      const byteArray = await fileData.Body.transformToByteArray()  // Uint8Array
      const blob = new Blob([byteArray], { type: fileData.ContentType })  // blob
      return {
        key: file.Key,
        blob: blob,
      }
    }
  })

  return await Promise.all(filePromises || [])
}
