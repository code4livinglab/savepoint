import { Button } from '@mui/material'
import { useFormStatus } from 'react-dom'

const ConfirmButton = () => {
  const { pending } = useFormStatus()
  return  (
    <Button
      type="submit"
      name="status"
      value="confirm"
      disabled={pending}
    >
      概要を生成する
    </Button>
  )
}

export default ConfirmButton
