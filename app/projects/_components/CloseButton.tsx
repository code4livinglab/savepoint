'use client'

import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'

export const CloseButton = () => {
  const router = useRouter()

  return (
    <Button variant="outlined" onClick={() => router.push('/projects')}>
      閉じる
    </Button>
  )
}
