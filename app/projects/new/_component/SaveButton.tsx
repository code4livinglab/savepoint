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
      disabled={pending}
    >
      保存する
    </Button>
  )
}

export default SaveButton
