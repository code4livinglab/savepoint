import { useFormStatus } from 'react-dom'

const ConfirmButton = () => {
  const { pending } = useFormStatus()
  return  (
    <>
      {pending ? (
        <button
          className="w-full text-gray-800 bg-white border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-200 focus:outline-none focus:border-gray-600"
        >
          プロジェクト概要を生成しています…
        </button>
      ) : (
        <button
          className="w-full text-gray-800 bg-white border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-200 focus:outline-none focus:border-gray-600"
          type="submit"
          name="status"
          value="confirm"
        >
          確認する
        </button>
      )}
    </>
  )
}

export default ConfirmButton
