'use client'

import { Button } from '@mui/material'
import { downloadAction } from '../action'

export const DownloadButton = ({
  projectId,
}: {
  projectId: string,
}) => {
  return (
    <Button
      variant="contained"
      type='submit'
      onClick={() => downloadProjectFiles(projectId)}
    >
      ロードする
    </Button>
  )
}

const downloadProjectFiles = async (projectId: string) => {
  const files = await downloadAction(projectId)

  files.forEach((file) => {
    if (!file || !file.key || !file.byteArray || !file.contentType) {
      return null
    }

    const byteArray = new Uint8Array(file.byteArray)
    const blob = new Blob([byteArray], { type: file.contentType })  // blob
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    
    a.href = url
    a.download = file.key.split('/').pop() ?? ''
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  })
}
