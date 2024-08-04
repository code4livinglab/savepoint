'use client'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Fab } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SaveProjectButton = async () => {
  const pathname = usePathname()
  if (pathname === '/projects/new') {
    return null
  }

  return (
    <Fab
      variant="extended"
      color="primary"
      sx={{ margin: 3 }}
      className="absolute bottom-0 right-0"
    >
      <CloudUploadIcon sx={{ mr: 1 }} />
      <Link href="/projects/new">セーブする</Link>
    </Fab>
  )
}
