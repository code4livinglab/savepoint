import { useFormStatus } from 'react-dom'

const NewProjectFormButton = () => {
  const { pending } = useFormStatus()
  return  (
    <button
    className="w-full text-gray-800 bg-white border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-200 focus:outline-none focus:border-gray-600"
    type="submit"
    disabled={pending}  // TODO: 機能しない
    >
      セーブする
    </button>
  )
}

export default NewProjectFormButton
