import { TypographyVariantsOptions } from "@mui/material"

const typography: TypographyVariantsOptions = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  h1: {
    fontSize: '2.5rem', // 40px
    fontWeight: 700,
    lineHeight: 1.2,
    '@media (max-width:900px)': {
      fontSize: '2rem', // 32px
    },
    '@media (max-width:600px)': {
      fontSize: '1.75rem', // 28px
    }
  },
  h2: {
    fontSize: '2rem', // 32px
    fontWeight: 700,
    lineHeight: 1.2,
    '@media (max-width:900px)': {
      fontSize: '1.75rem', // 28px
    },
    '@media (max-width:600px)': {
      fontSize: '1.5rem', // 24px
    }
  },
  h3: {
    fontSize: '1.75rem', // 28px
    fontWeight: 600,
    lineHeight: 1.2,
    '@media (max-width:900px)': {
      fontSize: '1.5rem', // 24px
    },
    '@media (max-width:600px)': {
      fontSize: '1.25rem', // 20px
    }
  },
  h4: {
    fontSize: '1.5rem', // 24px
    fontWeight: 600,
    lineHeight: 1.2,
    '@media (max-width:900px)': {
      fontSize: '1.25rem', // 20px
    },
    '@media (max-width:600px)': {
      fontSize: '1.125rem', // 18px
    }
  },
  h5: {
    fontSize: '1.25rem', // 20px
    fontWeight: 600,
    lineHeight: 1.2,
    '@media (max-width:900px)': {
      fontSize: '1.125rem', // 18px
    },
    '@media (max-width:600px)': {
      fontSize: '1rem', // 16px
    }
  },
  h6: {
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: 1.2,
    '@media (max-width:900px)': {
      fontSize: '1rem', // 16px
    },
    '@media (max-width:600px)': {
      fontSize: '0.875rem', // 14px
    }
  },
  subtitle1: {
    fontSize: '1rem', // 16px
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:900px)': {
      fontSize: '0.9375rem', // 15px
    },
    '@media (max-width:600px)': {
      fontSize: '0.875rem', // 14px
    }
  },
  subtitle2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:900px)': {
      fontSize: '0.8125rem', // 13px
    },
    '@media (max-width:600px)': {
      fontSize: '0.75rem', // 12px
    }
  },
  body1: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: 1.5,
    '@media (max-width:900px)': {
      fontSize: '0.9375rem', // 15px
    },
    '@media (max-width:600px)': {
      fontSize: '0.875rem', // 14px
    }
  },
  body2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: 1.5,
    '@media (max-width:900px)': {
      fontSize: '0.8125rem', // 13px
    },
    '@media (max-width:600px)': {
      fontSize: '0.75rem', // 12px
    }
  },
  button: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: 'none',
    '@media (max-width:900px)': {
      fontSize: '0.8125rem', // 13px
    },
    '@media (max-width:600px)': {
      fontSize: '0.75rem', // 12px
    }
  },
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: 1.5,
    '@media (max-width:900px)': {
      fontSize: '0.6875rem', // 11px
    },
    '@media (max-width:600px)': {
      fontSize: '0.625rem', // 10px
    }
  },
  overline: {
    fontSize: '0.75rem', // 12px
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: 'uppercase',
    '@media (max-width:900px)': {
      fontSize: '0.6875rem', // 11px
    },
    '@media (max-width:600px)': {
      fontSize: '0.625rem', // 10px
    }
  }
}

export default typography 