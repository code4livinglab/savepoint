'use client'

import {
  Logout,
  FormatListBulleted
} from '@mui/icons-material'
import {
  Avatar,
  ListItemIcon,
  IconButton,
  MenuItem,
  Menu,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOutAction } from '../actions'

export const UserMenuIcon = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isOpen = Boolean(anchorEl)
  const router = useRouter()

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => { setAnchorEl(null) }
  const handleSignOut = async () => { await signOutAction() }

  const moveToMyProjectList = () => { router.push('/mypage/projects') }

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
        <MenuItem onClick={moveToMyProjectList}>
          <ListItemIcon>
            <FormatListBulleted fontSize="small" />
          </ListItemIcon>
          プロジェクト一覧
        </MenuItem>
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
