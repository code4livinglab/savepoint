'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { readStreamableValue } from 'ai/rsc'
import ConfirmButton from './ConfirmButton'
import SaveButton from './SaveButton'
import { confirmAction, saveAction } from '../action'

const initialSaveState = {
  status: false,
  data: {},
}

const NewProjectForm = () => {
  const [description, setDescription] = useState('')  // プロジェクト概要
  const [save, saveFormAction] = useFormState(saveAction, initialSaveState)
  const router = useRouter()

  // 確認するときとセーブするときでアクションを分ける
  const newAction = async (formData: FormData) => {
    // 確認するとき
    if (formData.get('status') === 'confirm') {
      const files = formData.getAll('files') as File[]
      const webkitRelativePaths = files.map(file => file.webkitRelativePath)
      
      const response = await confirmAction(formData, webkitRelativePaths)
      for await (const content of readStreamableValue(response)) {
        setDescription(content as string)
      }
    }
    
    // セーブするとき
    if (formData.get('status') === 'save') {
      saveFormAction(formData)
    }
  }

  return (
    <form
      className="flex flex-col absolute z-10 top-0 right-0 bg-gray-800 bg-opacity-80 max-h-[85%] max-w-[40%] overflow-auto text-white rounded-xl border-2 border-gray-400 m-5 mt-20 p-5"
      action={newAction}
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
      <div className="my-5">
        <p className="text-xl">プロジェクト名*</p>
        {!save.status && typeof save.message !== 'undefined' && (
          <p>{ save.message }</p>
        )}
        <input
          name="name"
          type="text"
          className="w-full bg-inherit bg-clip-border border rounded-xl mt-2 p-3 focus:outline-none focus:bg-gray-900 focus:border-2"
        />
      </div>
      {description.length > 0 && (
        <div className="my-5">
          <p className="text-xl">プロジェクト概要</p>
          <textarea
            key={description}  // textareaの再レンダリングを走らせ、defalutValueを更新する。
            name="description"
            rows={8}
            className="w-full bg-inherit bg-clip-border border rounded-xl mt-2 p-3 focus:outline-none focus:bg-gray-900 focus:border-2"
            defaultValue={description}
          />
        </div>
      )}
      {/* @ts-ignore */}
      <input type="file" name="files" webkitdirectory="true" className="my-3" />
      <p className="text-sm my-3">
        ※ 以下で送信いただいた内容は(株)会津の暮らし研究室が行うSAVEPOINT実装に向けた実証実験等に活用されます。クライアント名などの固有名詞や、個人を特定できる内容は記載しないようお願いいたします。
      </p>
      {description.length > 0 ? <SaveButton /> : <ConfirmButton />}
    </form>
  )
}

export default NewProjectForm
