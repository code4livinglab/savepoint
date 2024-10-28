import { Button } from '@mui/material'
import { useFormStatus } from 'react-dom'

export const SignInFormButton = () => {
  const { pending } = useFormStatus()

  return (
    <Button
      variant="contained"
      type="submit"
      fullWidth
      disabled={pending}
    >
      Sign in
    </Button>
  )
}
