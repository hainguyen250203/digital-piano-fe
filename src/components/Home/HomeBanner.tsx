import { ArrowForward, MusicNote } from '@mui/icons-material'
import { Box, Button, Container, Grid, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import Image from 'next/image'
import Link from 'next/link'

export default function HomeBanner() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
        py: { xs: 6, md: 8 },
        mb: { xs: 6, md: 10 },
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          {/* Content Side */}
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
            <Box sx={{ px: { xs: 2, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <MusicNote fontSize="medium" />
                </Box>
                <Typography
                  variant="overline"
                  fontWeight={600}
                  color="primary"
                  letterSpacing={1.5}
                  fontSize="1rem"
                >
                  Mới ra mắt
                </Typography>
              </Box>
              
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  mb: 3,
                  lineHeight: 1.2
                }}
              >
                Khám phá thế giới nhạc cụ chuyên nghiệp
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 4,
                  color: 'text.secondary',
                  maxWidth: 580
                }}
              >
                Trải nghiệm âm nhạc đỉnh cao với đa dạng nhạc cụ cao cấp từ piano kỹ thuật số, guitar, violin 
                đến các loại nhạc cụ điện tử hiện đại. Sản phẩm chính hãng từ các thương hiệu hàng đầu thế giới với 
                chất lượng cao nhất và giá cả cạnh tranh.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  href="/products"
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 2
                  }}
                >
                  Khám phá ngay
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={Link}
                  href="/products?filter=featured"
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Sản phẩm nổi bật
                </Button>
              </Box>
            </Box>
          </Grid>
          
          {/* Image Side */}
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 260, sm: 320, md: 400, lg: 480 },
                mx: { xs: 2, md: 0 },
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Musical Instruments"
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                priority
              />

              {/* Overlay gradient */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)'
                }}
              />
              
              {/* Image caption */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  p: 3,
                  width: '100%',
                  color: 'white',
                }}
              >
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Premium Music Collection
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 400 }}>
                  Chất lượng âm thanh chuyên nghiệp, thiết kế tinh tế cho mọi người yêu nhạc
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
} 