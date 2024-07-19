'use server'

// import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import fs from 'fs'
import OpenAI from 'openai'
import pgvector from 'pgvector'
import { v4 as uuidv4 } from 'uuid'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { PrismaClient } from '@prisma/client'
import { ProjectCreate } from '@/app/_types/project'

export const action = async (formData: FormData) => {
  // フォームの取得
  const name = formData.get('name')?.toString() ?? ''
  const question1 = formData.get('question1')?.toString() ?? ''
  const question2 = formData.get('question2')?.toString() ?? ''
  const question3 = formData.get('question3')?.toString() ?? ''
  const question4 = formData.get('question4')?.toString() ?? ''

  // TODO: バリデーション

  // ペイロード
  const id = uuidv4()
  const teamId = 'admin'
  const description = `# ${name}

## それはどんなプロジェクトでしたか？お答えいただける範囲でお答えください。

${question1}

## 「壁にぶつかった」と感じたのはどんな状況でしたか？

${question2}

## あなたはそのプロジェクトで壁にぶつかった時、どのような行動をとりましたか？

${question3}

## そのプロジェクトはその後どうなりましたか？

${question4}
`

  // リクエスト
  const project: ProjectCreate = { id, name, description, teamId }
  const prisma = new PrismaClient();

  try {
    // エンべディング
    const openai = new OpenAI();
    const response = await openai.embeddings.create({
      input: description,
      model: 'text-embedding-ada-002',
    })

    // インサート
    const embedding = pgvector.toSql(response.data[0].embedding)
    const result: number = await prisma.$executeRaw`
INSERT INTO 
  public."Project" (
    id,
    name,
    description,
    embedding,
    "teamId"
  ) VALUES (
    ${id},
    ${name},
    ${description},
    ${embedding}::vector,
    ${teamId}
  )
`

    // 一時ファイルを作成
    const dirKey = `projects/${id}/`
    const fileKey = `${dirKey}README.md`
    fs.writeFileSync('README.md', description);

    // AWSのパラメータ
    const bucketName = process.env.AWS_BUCKET_NAME_RAW;
    const bucketRegion = process.env.AWS_BUCKET_REGION;
    const identityPoolId = process.env.AWS_IDENTITY_POOL_ID;

    const client = new S3Client({
      region: bucketRegion,
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: bucketRegion },
        identityPoolId: identityPoolId as string,
      }),
    });

    // ディレクトリの作成
    const dirCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: dirKey,
    })

    await client.send(dirCommand);

    // ファイルのアップロード
    const fileCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: fs.readFileSync('README.md'),
    })

    await client.send(fileCommand)
    
    // revalidateTag('/projects')
    redirect('/projects')

  } catch (error) {
    console.log({error})

  } finally {
    await prisma.$disconnect()
  }
}
