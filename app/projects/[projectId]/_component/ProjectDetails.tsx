'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import { Box } from '@mui/material'
import { File } from '@/app/_types/file'
import { Project } from '@/app/_types/project'
import { addRole } from '../action' 
import { downloadLoader } from '../loader'

const ProjectDetails = ({
  project,
  userRole,
}: {
  project: Project,
  userRole: string | null,
}) => {
  const [role, setRole] = useState(userRole)
  const router = useRouter()
  
  return (
    <Box sx={{mt: 2}} className="absolute top-20 m-5 flex flex-col max-h-[85%] text-white bg-gray-800 bg-opacity-80 overflow-auto rounded-xl border-2 border-gray-400 p-5">
      <button onClick={router.back} className="flex justify-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
      <Markdown className="prose prose-sm prose-invert">
        {project.description}
      </Markdown>
      {role ? (
        <>
          {/* {project.file_names && project.file_names?.length > 0 && (
            <>
              <h2 className="text-xl text-gray-200 font-semibold my-3">Data</h2>
              {project.file_names.map((filename, i) => (
                <button key={i}
                  className="text-left text-gray-300 my-1 hover:text-blue-300 hover:underline"
                  onClick={()=> viewProjectFile(project.id, filename)}
                >
                  ・{filename}
                </button>
              ))}
            </>
          )} */}
          <button
            className="text-gray-300 border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-900 focus:outline-none focus:border-gray-600"
            onClick={()=> downloadProjectFiles(project.id)}
          >
            ロードする
          </button>
        </>
      ) : (
        <div className="mt-10" >
          <h2 className="text-xl text-white">マイクロNDA</h2>
          <p className="mt-1 text-gray-300">ここにmicroNDAのテキストが入ります..</p>
          <button
            className="text-gray-300 border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-900 focus:outline-none focus:border-gray-600"
            onClick={async () => {
              const role = await addRole(project.id)
              setRole(role)
            }}
          >
            承認する
          </button>
        </div>
      )}
    </Box>
  )
}

// projectfileのダウンロード
const downloadProjectFiles = async (projectId: string) => {
  const files = await downloadLoader(projectId)
  
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

const viewProjectFile = async (projectId: string, fileName: string) => {
  try {
    const response = await fetch(`/api/${projectId}/files/${fileName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const href = data.url;

    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("viewfile error:", err);
  }
};

export default ProjectDetails
