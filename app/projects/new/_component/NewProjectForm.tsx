'use client'

import { useRouter } from 'next/navigation'
import TextArea from './TextArea'
import TextInput from './TextInput'

const NewProjectForm = ({
  action,
}: {
  action:(formData: FormData) => Promise<void>,
}) => {
  const router = useRouter()
  return (
    <form
      action={(formData: FormData) => {
        action(formData)
        router.push('/projects')
      }}
      className="flex flex-col absolute z-10 top-0 right-0 bg-gray-800 bg-opacity-80 max-h-[85%] max-w-[40%] overflow-auto text-white rounded-xl border-2 border-gray-400 m-5 mt-20 p-5"
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
      <h2 className="text-xl mb-5">
        ご自身の業務や参加コミュニティでプロジェクトを遂行している際、壁にぶつかったと感じた体験談を教えてください。
      </h2>
      <TextInput id="name">プロジェクト名*</TextInput>
      <TextArea id="question1">
        それはどんなプロジェクトでしたか？<br />お答えいただける範囲でお答えください。
      </TextArea>
      <TextArea id="question2">
        「壁にぶつかった」と感じたのはどんな状況でしたか？
      </TextArea>
      <TextArea id="question3">
        あなたはそのプロジェクトで壁にぶつかった時、<br />どのような行動をとりましたか？
      </TextArea>
      <TextArea id="question4">
        そのプロジェクトはその後どうなりましたか？
      </TextArea>
      <p className="text-sm my-3">
        ※ 以下で送信いただいた内容は(株)会津の暮らし研究室が行うSAVEPOINT実装に向けた実証実験等に活用されます。クライアント名などの固有名詞や、個人を特定できる内容は記載しないようお願いいたします。
      </p>

      <button
        className="w-full text-gray-800 bg-white border border-gray-300 rounded-full my-3 p-3 hover:bg-gray-200 focus:outline-none focus:border-gray-600"
      >
        セーブする
      </button>
    </form>
  )
}

export default NewProjectForm
