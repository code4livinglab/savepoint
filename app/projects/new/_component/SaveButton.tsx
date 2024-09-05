import { Button } from '@mui/material'
import { useFormStatus } from 'react-dom'

const SaveButton = () => {
  const { pending } = useFormStatus()
  
  return  (
    <Button
      type="submit"
      name="status"
      value="save"
      variant="contained"
      disabled={true}
    >
      保存する(現在は概要生成まで可能)
    </Button>
  )
}

export default SaveButton
