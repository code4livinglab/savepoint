import SearchIcon from '@mui/icons-material/Search'
import { Divider, IconButton, InputBase, Paper, Stack } from '@mui/material'

export const SearchProjectForm = ({
  formAction,
}: {
  formAction: (formData: FormData) => void
}) => {
  return (
    <Paper component="form" action={formAction}>
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ padding: 1 }}
      >
        <InputBase
          name="query"
          placeholder="プロジェクトを検索する"
          sx={{ width: 300, paddingLeft: 1 }}
        />
        <IconButton type="submit" >
          <SearchIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}
