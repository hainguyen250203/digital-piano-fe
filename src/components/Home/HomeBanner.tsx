import { ArrowForward, MusicNote } from '@mui/icons-material'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { alpha, keyframes } from '@mui/material/styles'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 5px 15px rgba(0, 104, 55, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 104, 55, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 5px 15px rgba(0, 104, 55, 0.2);
  }
`

export default function HomeBanner() {
  const theme = useTheme()
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(true)
  }, [])

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, 
                                     ${alpha(theme.palette.primary.main, 0.12)} 50%,
                                     ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        py: { xs: 4, sm: 6, md: 10 },
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        mb: { xs: 5, md: 8 },
        borderRadius: { xs: 2, md: 4 },
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(0,104,55,0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0,104,55,0.1) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          pointerEvents: 'none'
        }}
      />

      <Box maxWidth='1400px' mx='auto' display='flex' flexDirection={{ xs: 'column-reverse', md: 'row' }} alignItems='center' gap={{ xs: 4, md: 6 }}>
        {/* Content */}
        <Box
          width={{ xs: '100%', md: '50%' }}
          sx={{
            animation: animated ? `${fadeIn} 0.8s ease-out` : 'none',
            opacity: animated ? 1 : 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, md: 3 } }}>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                borderRadius: '50%',
                width: { xs: 36, sm: 48, md: 56 },
                height: { xs: 36, sm: 48, md: 56 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: 3,
                animation: `${pulse} 3s infinite ease-in-out`
              }}
            >
              <MusicNote fontSize={theme.breakpoints.up('sm') ? 'medium' : 'small'} />
            </Box>
            <Typography
              variant='overline'
              color='primary'
              sx={{
                fontWeight: 700,
                letterSpacing: { xs: 1, md: 2 },
                textTransform: 'uppercase',
                borderRadius: 1,
                py: 0.5,
                px: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.08)
              }}
            >
              Mới ra mắt
            </Typography>
          </Box>

          <Typography
            variant='h2'
            sx={{
              mb: { xs: 2, sm: 3 },
              lineHeight: { xs: 1.1, sm: 1.2 },
              fontWeight: 800,
              maxWidth: '600px',
              fontSize: {
                xs: '1.75rem', // 28px trên mobile
                sm: '2rem', // 32px trên tablet nhỏ
                md: '2.25rem', // 36px trên tablet
                lg: '2.5rem' // 40px trên desktop
              },
              background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}
          >
            {/* Hiển thị tiêu đề dài trên màn hình > sm */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Khám phá thế giới nhạc cụ chuyên nghiệp</Box>
            {/* Hiển thị tiêu đề ngắn hơn trên mobile */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Khám phá nhạc cụ chuyên nghiệp</Box>
          </Typography>

          <Typography
            variant='body1'
            sx={{
              mb: { xs: 3, md: 4 },
              color: 'text.secondary',
              maxWidth: 580,
              lineHeight: { xs: 1.5, md: 1.6 },
              fontSize: { xs: '0.875rem', md: '1.125rem' }
            }}
          >
            Trải nghiệm âm nhạc đỉnh cao với đa dạng nhạc cụ cao cấp từ piano kỹ thuật số, guitar, violin đến các loại nhạc cụ điện tử hiện đại. Sản phẩm chính hãng từ các thương hiệu hàng đầu thế
            giới với chất lượng cao nhất và giá cả cạnh tranh.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              mt: { xs: 2, md: 3 }
            }}
          >
            <Button
              variant='contained'
              color='primary'
              size={theme.breakpoints.down('sm') ? 'medium' : 'large'}
              component={Link}
              href='/products'
              endIcon={<ArrowForward />}
              sx={{
                'borderRadius': 2,
                'py': { xs: 1, md: 1.5 },
                'px': { xs: 2, md: 3 },
                'fontWeight': 600,
                'textTransform': 'none',
                'boxShadow': 3,
                'transition': 'all 0.3s ease',
                'backgroundImage': `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Khám phá ngay
            </Button>
            <Button
              variant='outlined'
              color='primary'
              size={theme.breakpoints.down('sm') ? 'medium' : 'large'}
              component={Link}
              href='/products?filter=featured'
              sx={{
                'borderRadius': 2,
                'py': { xs: 1, md: 1.5 },
                'px': { xs: 2, md: 3 },
                'fontWeight': 600,
                'textTransform': 'none',
                'borderWidth': 2,
                'transition': 'all 0.3s ease',
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Sản phẩm nổi bật
            </Button>
          </Box>
        </Box>

        {/* Image */}
        <Box
          width={{ xs: '100%', md: '50%' }}
          sx={{
            'position': 'relative',
            'height': { xs: 240, sm: 300, md: 440, lg: 500 },
            'borderRadius': { xs: 2, md: 4 },
            'overflow': 'hidden',
            'boxShadow': { xs: 2, md: 4 },
            'transform': animated ? 'translateY(0)' : 'translateY(20px)',
            'opacity': animated ? 1 : 0,
            'transition': 'all 0.8s ease-out 0.2s',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: 'inherit',
              pointerEvents: 'none'
            }
          }}
        >
          <Image
            src='https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
            alt='Musical Instruments'
            fill
            sizes='(max-width: 900px) 100vw, 50vw'
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.6s ease-out'
            }}
            priority
          />

          {/* Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '70%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
              zIndex: 1
            }}
          />

          {/* Caption */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              p: { xs: 2, sm: 4 },
              width: '100%',
              color: 'white',
              zIndex: 2
            }}
          >
            <Typography
              variant='h5'
              fontWeight={700}
              sx={{
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Premium Music Collection
            </Typography>
            <Typography
              variant='subtitle2'
              sx={{
                maxWidth: { xs: '100%', md: '80%' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'block' },
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                fontWeight: 500
              }}
            >
              Chất lượng âm thanh chuyên nghiệp, thiết kế tinh tế cho mọi người yêu nhạc
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
