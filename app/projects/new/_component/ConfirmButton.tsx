import { useFormStatus } from 'react-dom'

const ConfirmButton = () => {
  const { pending } = useFormStatus()
  return  (
    <>
      {pending ? (
        <button
          className="w-full text-white border border-white rounded-full my-3 p-3 bg-gray-900"
        >
          プロジェクト概要を生成しています…
        </button>
      ) : (
        <button
          className="w-full text-white border border-white rounded-full my-3 p-3 hover:bg-gray-900"
          type="submit"
          name="status"
          value="confirm"
        >
          プロジェクト概要を生成する
        </button>
      )}
    </>
  )
}

export default ConfirmButton
