import { useRouter } from 'next/navigation'
import { List, ListItemButton } from '@mui/material'
import { Project } from '@/app/_types/project'

const ProjectSearchList = ({
  projectList,
  onClose,
}: {
  projectList: Project[],
  onClose: () => void,
}) => {
  const router = useRouter()

  return (
    <List
      sx={{ mt: 2 }}
      className="flex flex-col bg-gray-800 bg-opacity-80 max-h-[85%] max-w-[30%] overflow-auto rounded-xl border-2 border-gray-400 p-5"
    >
      <button onClick={onClose} className="flex justify-end mx-5 my-3">
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
      {projectList.map((project) => {
        const id = project.id
        const name = project.name

        return (
          <ListItemButton
            key={id}
            alignItems='flex-start'
            divider
            className="flex flex-col"
            onClick={() => {
              onClose()
              router.push(`/projects/${id}`)
            }}
          >
            <h2 className="text-xl text-white font-bold m-2">{ name }</h2>
            <p className="text-gray-400 m-2">{ project.description }</p>
          </ListItemButton>
        )
      })}
    </List>
  )
}

export default ProjectSearchList
