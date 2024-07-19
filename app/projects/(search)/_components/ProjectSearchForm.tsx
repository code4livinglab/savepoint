const ProjectSearchForm = ({
  formAction,
}: {
  formAction: (formData: FormData) => void
}) => {
  return (
    <form className="flex w-64 sm:w-80 md:w-96" action={formAction}>
      <input
          type="text"
          name='query'
          placeholder="プロジェクトを検索する"
          className="text-white placeholder-gray-400 border-2 border-gray-800 bg-gray-800 bg-opacity-80 rounded-l-full p-3 pl-6 w-full focus:outline-none focus:border-gray-600"
        />
        <button className="whitespace-nowrap text-white border-2 border-gray-800 bg-gray-800 bg-opacity-80 rounded-r-full p-3 pr-6 hover:bg-gray-700 hover:border-gray-700 active:bg-gray-800 active:border-gray-800">検索</button>
      </form>
  )
}

export default ProjectSearchForm
