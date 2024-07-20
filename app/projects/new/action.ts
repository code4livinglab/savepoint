'use server'

import path from 'path'
// import { revalidateTag } from 'next/cache'
// import { redirect } from 'next/navigation'
import OpenAI from 'openai'
import pgvector from 'pgvector'
import { v4 as uuidv4 } from 'uuid'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { PrismaClient } from '@prisma/client'
import { textMimeTypeList } from '@/app/_types/file'

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: process.env.AWS_BUCKET_REGION },
    identityPoolId: process.env.AWS_IDENTITY_POOL_ID as string,
  }),
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const PROMPT = `
共有された **すべてのファイルと画像について** 、内容を以下の形式にまとめて出力してください。

\`\`\`
## 概要

{ プロジェクトの概要を記入する。 }

## 背景

{ プロジェクトの背景を記入する。 }

## 目的

{ プロジェクトの目的を記入する。 }

## 解決策

{ プロジェクトの解決策を記入する。 }
\`\`\`
`

const prisma = new PrismaClient()

export const action = async (formData: FormData) => {
  // フォームの取得
  const name = formData.get('name')?.toString() ?? ''
  const files = formData.getAll('files') as File[]

  // TODO: バリデーション

  try {
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
          image_file: { file_id: file.id }
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
          tools: [{ type: 'file_search' }]
        }
      })
    )

    const assistant = await openai.beta.assistants.create({
      name: 'SAVE ASSISTANT',
      description: '',
      model: 'gpt-4o-mini',
      tools: [{ type: 'file_search' }],
    })

    const thread = await openai.beta.threads.create({
      // @ts-ignore
      messages: [
        {
          'role': 'user',
          'content': [
            {
              'type': 'text',
              'text': PROMPT,
            },
            ...imageContents,
          ],
          attachments: attachments,
        }
      ]
    })

    const stream = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistant.id
    })

    let message = ''
    for await (const event of stream) {
      // @ts-ignore
      const delta = event.data?.delta?.content?.[0]?.text?.value ?? ''
      message += delta
      process.stdout.write(delta)
    }

      // ペイロード
  const id = uuidv4()
  const teamId = 'admin'
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

    return message
  } catch (error) {
    console.log({error})

  } finally {
    await prisma.$disconnect()
  }
}
