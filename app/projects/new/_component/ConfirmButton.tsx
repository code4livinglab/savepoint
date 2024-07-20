import { useFormStatus } from 'react-dom'

const ConfirmButton = () => {
  const { pending } = useFormStatus()
  return  (
    <button
      className="w-full text-gray-800 bg-white border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-200 focus:outline-none focus:border-gray-600"
      type="submit"
      name="status"
      value="confirm"
      disabled={pending}  // TODO: 機能しない
    >
      確認する
    </button>
  )
}

export default ConfirmButton
