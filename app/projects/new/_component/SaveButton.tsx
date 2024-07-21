import { useFormStatus } from 'react-dom'

const SaveButton = () => {
  const { pending } = useFormStatus()
  return  (
    <>
      {pending ? (
        <button
          className="w-full text-gray-800 bg-white border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-200 focus:outline-none focus:border-gray-600"
        >
          セーブしています…
        </button>
      ) : (
        <button
          className="w-full text-gray-800 bg-white border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-200 focus:outline-none focus:border-gray-600"
          type="submit"
          name="status"
          value="save"
        >
          セーブする
        </button>
      )}
    </>

  )
}

export default SaveButton
