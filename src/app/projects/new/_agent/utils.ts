import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync
} from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'

export const writeTempFilesSync = async (files: File[]) => {
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

  // 一時ファイルを削除
  const rmTempFilesSync = () => rmSync(tmpDir, { recursive: true })
  return { tmpDir, rmTempFilesSync }
}
