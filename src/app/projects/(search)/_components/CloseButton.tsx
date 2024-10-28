import { Button } from '@mui/material'

export const CloseButton = ({
  onClick,
}: {
  onClick: () => void
}) => {
  return (
    <Button variant="outlined" onClick={onClick} fullWidth>
      閉じる
    </Button>
  )
}
