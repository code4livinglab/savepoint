import { readFileSync } from 'fs'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { dirname, extname, join } from 'path'
// import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
// import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
// import { JSONLoader } from 'langchain/document_loaders/fs/json'
// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
// import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx'
// import { TextLoader } from 'langchain/document_loaders/fs/text'
import { writeTempFilesSync } from './utils'

// ドキュメントローダー
// export const documentsLoader = async (files: File[]) => {
//   // MIME type が text か application のファイルを取得
//   const documentFiles = files.filter((file) => {
//     const type = file.type
//     return type.startsWith('text') || type.startsWith('application')
//   })

//   // 一時ファイルを作成
//   const { tmpDir, rmTempFilesSync } = await writeTempFilesSync(documentFiles)

//   // ファイルローダーの定義
//   const loaders = {
//     // '.csv': (path: string) => new CSVLoader(path),
//     // '.docx': (path: string) => new DocxLoader(path),
//     // '.json': (path: string) => new JSONLoader(path),
//     // '.pdf': (path: string) => new PDFLoader(path),
//     // '.pptx': (path: string) => new PPTXLoader(path),
//     // '.txt': (path: string) => new TextLoader(path),
//   }

//   // 定義されていない拡張子をテキストとしてロード
//   const unknownLoaders = documentFiles.reduce((object, file) => {
//     const key = extname(file.name)
//     if (key in loaders || key.length == 0) {
//       return object
//     }

//     // return { ...object, [key]: (path: string) => new TextLoader(path) }
//     return object
//   }, {})
  
//   // コンテンツを読み込み
//   const loader = new DirectoryLoader(tmpDir, { ...loaders, ...unknownLoaders })
//   const documents = await loader.load()
//   const content = documents.reduce(
//     (content, document) => content + '\n\n' + document.pageContent,
//     '',  // 初期値
//   )

//   // 一時ファイルを削除
//   rmTempFilesSync()
//   return content
// }

// ドキュメントローダー
export const documentsLoader = async (files: File[]) => {
  // MIME type が text か application のファイルを取得
  const documentFiles = files.filter((file) => {
    const type = file.type
    return (
      type.startsWith('text')
      || type.startsWith('application/json')
      || type.startsWith('application/x-sh')
      || type.startsWith('application/rtf')
      || type.startsWith('application/xhtml+xml')
      || type.startsWith('application/xml')
      || type.startsWith('application/octet-stream')
    )
  })

  // 一時ファイルを作成
  const { tmpDir, rmTempFilesSync } = await writeTempFilesSync(documentFiles)

  // 画像を読み込み
  const documents = documentFiles.map((file) => {
    const filename = file.name
    const dirName = dirname(file.webkitRelativePath)

    const fileDir = join(tmpDir, dirName)
    const filePath = join(fileDir, filename)
    return readFileSync(filePath).toString()
  })
  
  const content = documents.reduce(
    (content, document) => content + '\n\n' + document,
    '',  // 初期値
  )

  // 一時ファイルを削除
  rmTempFilesSync()
  return content
}

// イメージローダー
export const imagesLoader = async (files: File[]) => {
  // MIME type が image のファイルを取得
  const imageFiles = files.filter((file) => file.type.startsWith('image'))

  // 一時ファイルを作成
  const { tmpDir, rmTempFilesSync } = await writeTempFilesSync(imageFiles)

  // 画像を読み込み
  const images = imageFiles.map((file) => {
    const filename = file.name
    const dirName = dirname(file.webkitRelativePath)

    const fileDir = join(tmpDir, dirName)
    const filePath = join(fileDir, filename)
    return readFileSync(filePath)
  })

  // 一時ファイルを削除
  rmTempFilesSync()
  return images
}
