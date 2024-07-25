'use client'

import { useRouter } from 'next/navigation'

export const BackButton = () => {
  const router = useRouter()

  return (
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
  )
}
