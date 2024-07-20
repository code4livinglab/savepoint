'use client'

import { useRouter } from 'next/navigation'
import NewProjectFormButton from './NewProjectFormButton'
import TextInput from './TextInput'
import { action } from '../action'

const NewProjectForm = () => {
  const router = useRouter()

  return (
    <form
      action={action}
      className="flex flex-col absolute z-10 top-0 right-0 bg-gray-800 bg-opacity-80 max-h-[85%] max-w-[40%] overflow-auto text-white rounded-xl border-2 border-gray-400 m-5 mt-20 p-5"
      encType="multipart/form-data"
    >
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
      <TextInput id="name">プロジェクト名*</TextInput>
      <input type="file" name="files" multiple className="my-3" />
      <p className="text-sm my-3">
        ※ 以下で送信いただいた内容は(株)会津の暮らし研究室が行うSAVEPOINT実装に向けた実証実験等に活用されます。クライアント名などの固有名詞や、個人を特定できる内容は記載しないようお願いいたします。
      </p>
      <NewProjectFormButton />
    </form>
  )
}

export default NewProjectForm
