import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx'
import { TextLoader } from 'langchain/document_loaders/fs/text'

export const filesLoader = async (files: File[]) => {
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
  
  // ドキュメントローダーの定義
  const loader = new DirectoryLoader(tmpDir, {
    '.csv': (path: string) => new CSVLoader(path),
    '.docx': (path: string) => new DocxLoader(path),
    '.json': (path: string) => new JSONLoader(path),
    '.pdf': (path: string) => new PDFLoader(path),
    '.pptx': (path: string) => new PPTXLoader(path),
    '.txt': (path: string) => new TextLoader(path),
  })

  // コンテンツの取得
  const documents = await loader.load()
  const content = documents.reduce(
    (content, document) => content + '\n\n' + document.pageContent,
    '',  // 初期値
  )

  // 一時ファイルを削除
  rmSync(tmpDir, { recursive: true })
  return content
}
