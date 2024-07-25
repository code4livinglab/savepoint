'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import { Box } from '@mui/material'
// import { File } from '@/app/_types/file'
import { Project } from '@/app/_types/project'
import MicroNDA from './MicroNDA'
import Download from './Download'

const ProjectDetails = ({
  project,
  userRole,
}: {
  project: Project,
  userRole: string | null,
}) => {
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
      {userRole ? (
        <Download projectId={project.id} />
      ) : (
        <MicroNDA projectId={project.id} />
      )}
    </Box>
  )
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
