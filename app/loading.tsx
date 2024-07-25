'use client'

import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';

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
      <Typography variant="h5">Welcome to SAVEPOINT</Typography>
      <LinearProgress className="w-1/4 m-20"/>
    </Box>
  )
}
