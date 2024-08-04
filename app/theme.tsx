'use client'

import { Container, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
})

export const MUIThemeProvider = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container disableGutters>
        {children}
      </Container>
    </ThemeProvider>
  )
}
