'use server'

import path from 'path'
import OpenAI from 'openai'
import pgvector from 'pgvector'
import { v4 as uuidv4 } from 'uuid'
import { redirect } from 'next/navigation'
import { createStreamableValue } from 'ai/rsc'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { PrismaClient } from '@prisma/client'
import { textMimeTypeList } from '@/app/_types/file'
import { PROMPT } from '@/app/_types/prompt'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
  project: process.env.OPENAI_PROJECT,
})

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: process.env.AWS_BUCKET_REGION },
    identityPoolId: process.env.AWS_IDENTITY_POOL_ID as string,
  }),
})

// ファイルからdescriptionの生成
export const confirmAction = async (formData: FormData) => {
  // フォームの取得
  const files = formData.getAll('files') as File[]
  
  // TODO: バリデーション

  // Visionから入力するファイルのリストを作成
  const imageContents = await Promise.all(
    files
    .filter((file) => file.type.startsWith('image/'))
    .map(async (formFile) => {
      const file = await openai.files.create({
        file: formFile,
        purpose: 'assistants',
      });
      
      return {
        type: 'image_file',
        image_file: { file_id: file.id },
      };
    })
  )
  
  // File Searchから入力するファイルのリストを作成
  const attachments = await Promise.all(
    files
    .filter((file) => textMimeTypeList.includes(path.extname(file.name)))
    .map(async (formFile) => {
      const file = await openai.files.create({
        file: formFile,
        purpose: 'assistants',
      })

      return {
        file_id: file.id,
        tools: [{ type: 'file_search' }],
      }
    })
  )

  // スレッドの作成
  const thread = await openai.beta.threads.create({
    // @ts-ignore
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: PROMPT }, ...imageContents],
        attachments: attachments,
      }
    ]
  })
  
  // ランの作成
  const stream = openai.beta.threads.runs.stream(thread.id, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID ?? '',
  })

  // アップロードしたファイルの削除
  await Promise.all([
    ...imageContents.map(async (content) => {
      await openai.files.del(content.image_file.file_id)
    }),
    ...attachments.map(async (attachment) => {
      await openai.files.del(attachment.file_id)
    })
  ])

  const newStream = createStreamableValue(stream.toReadableStream())
  return newStream.value
}

// ProjectのDBへの保存・ファイルのS3へのアップロード
export const saveAction = async (prevState: any, formData: FormData) => {
  // フォームの取得
  const name = formData.get('name')?.toString() ?? ''
  const message = formData.get('description')?.toString() ?? ''
  const files = formData.getAll('files') as File[]

  // バリデーション
  if (!name.length) {
    return {
      status: false,
      message: 'プロジェク名は1文字以上の長さにしてください。'
    }
  }

  try {
    // ペイロード
    const id = uuidv4()
    const description = `# ${name}

${message}
`
  
    // エンべディング
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
    embedding
  ) VALUES (
    ${id},
    ${name},
    ${description},
    ${embedding}::vector
  )
`

    // ファイルのアップロード
    const dirKey = `projects/${id}/`
    for (const file of files) {
      const fileBuffer = await file.arrayBuffer()
      const fileKey = `${dirKey}${file.name}`
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_RAW,
        Key: fileKey,
        Body: Buffer.from(fileBuffer),
      }))
    }
  } catch (error) {
    console.log({error})
    return {
      status: false,
      message: '内部エラーが発生しました。開発者にお問合せください。'
    }
  } finally {
    await prisma.$disconnect()
  }

  redirect('/projects')
  return {
    status: true,
    data: {},
  }
}
