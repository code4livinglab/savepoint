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
    if (!file || !file.key || file.blob) {
      return null
    }

    const url = window.URL.createObjectURL(file.blob)
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
