import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E1E1E',
      // main: '#fff'
    },
    secondary: {
      main: '#3A64D8'
    },
    info: {
      main: '#fffff'
      // main: '#1E1E1E'
      // main: 'rgba(255,255,255,0.3)'
    },
    error: {
      main: '#C40303'
    }
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: '#FFFFFF'
        }
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'fixed',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'black',
          height: 60
        },
      }
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          color: 'white',
          fontSize: 30,
          fontWeight: 600
        },
        h2: {
          color: 'white',
          fontSize: 20,
          fontWeight: 400
        },
        subtitle1: {
          color: 'white',
          fontSize: 18,
          fontWeight: 600
        }
      }
    },


    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'small',
        disableElevation: false,
        color: 'info'
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: 'white',
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: 10,
          ":hover": {
            backgroundColor: 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease-in-out'
          }
        }
      }
    },

    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          boxShadow: '0px 5px 5px rgba(0,0,0,0.05)',
          borderRadius: '10px',
        }
      }
    }
    
  }
});