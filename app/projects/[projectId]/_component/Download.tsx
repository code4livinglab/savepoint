'use client'

import { downloadAction } from '../action'

const Download = ({
  projectId,
}: {
  projectId: string,
}) => {
  return (
    <button
      className="text-gray-300 border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-900 focus:outline-none focus:border-gray-600"
      onClick={() => downloadProjectFiles(projectId)}
    >
      ロードする
    </button>
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

export default Download
