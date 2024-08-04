'use client'

import { Logout } from '@mui/icons-material'
import {
  Avatar,
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

  const handleClose = () => { setAnchorEl(null) }
  const handleSignOut = async () => { await signOutAction() }

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        onClick={handleOpen}
        sx={{ width: 56, height: 56, margin: 0 }}
      >
        <Avatar />
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
    </>
  )
}
