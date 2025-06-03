import { createTheme } from '@mui/material/styles'
import typography from './typography'

const theme = createTheme({
  typography,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px'
        }
      }
    }
  }
})

export default theme 