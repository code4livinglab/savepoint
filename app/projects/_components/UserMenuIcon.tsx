'use client'

import { AccountCircle, Logout } from '@mui/icons-material'
import {
  Box,
  ListItemIcon,
  IconButton,
  MenuItem,
  Menu,
} from '@mui/material'
import { useState } from 'react'
import { signOutAction } from '../actions'

export const UserMenuIcon = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isOpen = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    await signOutAction()
  }

  return (
    <Box>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        onClick={handleOpen}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          ログアウトする
        </MenuItem>
      </Menu>
    </Box>
  )
}
