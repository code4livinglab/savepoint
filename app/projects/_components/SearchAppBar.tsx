import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { SearchBar } from './Search'
import { UserMenuIcon } from './UserMenuIcon'

export const StyledAppBar = () => {
  return (
    <AppBar position="static" sx={{
      flexGrow: 1,
      backgroundColor: 'black',
    }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          savepoint
        </Typography>
        <SearchBar />
        <Box sx={{ flexGrow: 1 }} />
        <UserMenuIcon />
      </Toolbar>
    </AppBar>
  )
}
