'use client'

import { Container, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export const MUIThemeProvider = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container disableGutters>
        <p>hoge</p>
        {children}
      </Container>
    </ThemeProvider>
  )
}
