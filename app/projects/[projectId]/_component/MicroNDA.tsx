import { addRole } from '../action'

const MicroNDA = ({
  projectId,
}: {
  projectId: string,
}) => {
  return (
    <div className="mt-10" >
      <h2 className="text-xl text-white">マイクロNDA</h2>
      <p className="mt-1 text-gray-300">ここにmicroNDAのテキストが入ります..</p>
      <button
        className="text-gray-300 border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-900 focus:outline-none focus:border-gray-600"
        onClick={async () => { await addRole(projectId) }}
      >
        承認する
      </button>
    </div>
  )
}

export default MicroNDA
