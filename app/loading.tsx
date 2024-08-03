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
      className="bg-black"
    >
      <Typography variant="h5" className='text-white'>Welcome to SAVEPOINT</Typography>
      <LinearProgress className="w-1/3 m-20"/>
    </Box>
  )
}