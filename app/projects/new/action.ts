'use server'

import pgvector from 'pgvector'
import { v4 as uuidv4 } from 'uuid'
import { redirect } from 'next/navigation'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { PrismaClient } from '@prisma/client'
import { auth } from "../../auth"
import { revalidatePath } from 'next/cache'

import { openai } from '@ai-sdk/openai'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { MultiFileLoader } from 'langchain/document_loaders/fs/multi_file'
import { dirname, extname, join } from 'path'
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { generateFilesObjectAgent, streamSummaryTextAgent } from './agents'

const prisma = new PrismaClient()
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: process.env.AWS_BUCKET_REGION },
    identityPoolId: process.env.AWS_IDENTITY_POOL_ID as string,
  }),
})

// ファイルからdescriptionの生成
export const confirmAction = async (
  formData: FormData,
  webkitRelativePaths: string[],
) => {
  // 重要なファイルをピックアップ
  const paths = await generateFilesObjectAgent(webkitRelativePaths)

  // フォームデータを取得
  const formFiles = formData.getAll('files') as File[]
  const files = formFiles
    // formFileにwebkitRelativePathが含まれないため手動で追加
    .map((file, i) => {
      const webkitRelativePath = webkitRelativePaths[i]
      return Object.assign(file, { webkitRelativePath })  // readonlyを上書き
    })
    // 重要なファイルのformFileのみを取得
    .filter((file) => paths.includes(file.webkitRelativePath))

  // 一時ファイルを作成
  const prefix = join(tmpdir(), 'savepoint-')
  const tmpDir = mkdtempSync(prefix)
  for (const file of files) {
    const filename = file.name
    const dirName = dirname(file.webkitRelativePath)
    const buffer = Buffer.from(await file.arrayBuffer())

    const fileDir = join(tmpDir, dirName)
    const filePath = join(fileDir, filename)
    mkdirSync(fileDir, { recursive: true })
    writeFileSync(filePath, buffer)
  }

  // ドキュメントを読み込み
  const loaders = {
    '.csv': (path: string) => new CSVLoader(path),
    '.docx': (path: string) => new DocxLoader(path),
    '.json': (path: string) => new JSONLoader(path),
    '.pdf': (path: string) => new PDFLoader(path),
    '.pptx': (path: string) => new PPTXLoader(path),
    '.txt': (path: string) => new TextLoader(path),
  }

  const loader = new MultiFileLoader(
    paths
      // loadersに拡張子が定義されているファイルのみを抽出
      .filter((path: string) => extname(path) in loaders)
      .map((path) => join(tmpDir, path)),
    loaders,
  )

  const documents = await loader.load()
  const content = documents.reduce(
    (content, document) => content + '\n\n' + document.pageContent,
    ''  // 初期値
  )

  // 一時ファイルを削除
  rmSync(tmpDir, { recursive: true })
  
  // プロジェクト概要を生成
  const summaryStream = await streamSummaryTextAgent(content)
  return summaryStream
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

    // Projectのインサート
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

    // projectUserのインサート
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      throw new Error('Failed to add role: User ID is null or undefined')
    }

    await prisma.projectUser.create({
      data: {
        userId: userId,
        projectId: id,
        role: 'OWNER',
      },
    }) 

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

  revalidatePath('/projects')
  redirect('/projects')
  return {
    status: true,
    data: {},
  }
}
