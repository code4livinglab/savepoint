'use client'
import { Box } from '@mui/material'
import { addRole } from '../action' 
import { useRouter } from 'next/navigation'
import { Project } from '@/app/_types/project'


const MicroNDA = ({
  project,
}: {
  project: Project,
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
     
      <div >
        <h1>{ project.name }</h1>
        <h2 className="text-gray-300">マイクロNDA</h2>
        <p className="text-gray-300">ここに利用規約のテキストが入ります..</p>

        <button
        className="text-gray-300 border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-900 focus:outline-none focus:border-gray-600"
        onClick={() => acceptNDA(project.id) }
      >
        承認する
      </button>
      </div>
    </Box>
  )
}

const acceptNDA = async (projectId:string) =>{

  const isSuccess = await addRole(projectId)

  if (isSuccess) {
    window.location.reload() // 成功した場合、画面をリロード
  }
}

export default MicroNDA