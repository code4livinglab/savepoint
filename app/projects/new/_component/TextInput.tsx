import { ReactNode } from 'react'

const TextInput = ({
  id,
  children,
}: {
  id: string,
  children: ReactNode,
}) => (
  <div className="my-5">
    <p className="text-xl">{ children }</p>
    <input
      id={id}
      type="text"
      className="w-full bg-inherit bg-clip-border border rounded-xl mt-2 p-3 focus:outline-none focus:bg-gray-900 focus:border-2"
    />
  </div>
)

export default TextInput
