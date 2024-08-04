import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Fab } from '@mui/material'
import Link from 'next/link'

export const SaveProjectButton = async () => {
  //
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
