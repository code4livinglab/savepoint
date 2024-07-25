'use client'

import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h5" className="m-10">Welcome to SAVEPOINT</Typography>
      <LinearProgress className="w-1/4 m-10"/>
    </Box>
  )
}
