import { ReactNode } from 'react'

const TextArea = ({
  id,
  children,
}: {
  id: string,
  children: ReactNode,
}) => (
  <div className="my-5">
    <p className="text-xl">{ children }</p>
    <textarea
      id={id}
      className="w-full h-20 bg-inherit bg-clip-border border rounded-xl mt-2 p-3 focus:outline-none focus:bg-gray-900 focus:border-2"
      maxLength={300}
    />
  </div>
)

export default TextArea
