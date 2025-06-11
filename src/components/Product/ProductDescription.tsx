import { DescriptionBlock } from '@/types/product.type'
import { DescriptionOutlined, ExpandMore, InfoOutlined } from '@mui/icons-material'
import { Box, IconButton, Paper, Typography, alpha, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ProductDescriptionProps {
  description: string
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [showDescription, setShowDescription] = useState(false)
  const [descriptionBlocks, setDescriptionBlocks] = useState<DescriptionBlock[]>([])

  // Toggle description visibility
  const toggleDescription = () => {
    setShowDescription(prev => !prev)
  }

  // Parse description on load
  useEffect(() => {
    if (description) {
      try {
        // Try to parse as JSON
        const parsedBlocks = JSON.parse(description)
        if (Array.isArray(parsedBlocks)) {
          setDescriptionBlocks(parsedBlocks)
        } else {
          // If not an array, create a single paragraph block
          setDescriptionBlocks([{ type: 'paragraph', content: description }])
        }
      } catch {
        // If parsing fails, it's plain text
        setDescriptionBlocks([{ type: 'paragraph', content: description }])
      }
    }
  }, [description])

  // Render different description block types
  const renderDescriptionBlock = (block: DescriptionBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <Typography
            key={index}
            variant='h6'
            fontWeight={600}
            sx={{
              mt: 3,
              mb: 2,
              color: 'primary.main',
              display: 'inline-block'
            }}
          >
            {block.content}
          </Typography>
        )
      case 'paragraph':
        return (
          <Typography
            key={index}
            variant='body1'
            sx={{
              mb: 2.5,
              lineHeight: 1.8,
              color: alpha(theme.palette.text.primary, 0.9),
              textAlign: 'justify'
            }}
          >
            {block.content}
          </Typography>
        )
      case 'specs':
        return (
          <Box key={index} sx={{ mb: 3 }}>
            <Box
              component='ul'
              sx={{
                'pl': 3,
                '& li': {
                  'mb': 1,
                  'position': 'relative',
                  '&::before': {
                    content: '"•"',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    position: 'absolute',
                    left: -15
                  }
                }
              }}
            >
              {block.content.map((spec, i) => (
                <Typography component='li' key={i} variant='body1' sx={{ color: alpha(theme.palette.text.primary, 0.9) }}>
                  {spec}
                </Typography>
              ))}
            </Box>
          </Box>
        )
      case 'image':
        return (
          <Box key={index} sx={{ my: 3 }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 250, sm: 300, md: 400 },
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Image
                src={block.content.src}
                alt={block.content.alt}
                fill
                style={{
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          pb: 2,
          borderBottom: '2px solid',
          borderColor: 'primary.main'
        }}
      >
        <Typography
          variant='h5'
          fontWeight={700}
          color='primary.main'
          sx={{
            'display': 'flex',
            'alignItems': 'center',
            'gap': 1,
            '& .MuiSvgIcon-root': {
              fontSize: '1.5rem'
            }
          }}
        >
          <DescriptionOutlined /> Mô tả sản phẩm
        </Typography>
        {isMobile && (
          <IconButton
            size='small'
            color='primary'
            onClick={toggleDescription}
            sx={{
              'transition': 'transform 0.3s ease',
              'transform': showDescription ? 'rotate(180deg)' : 'rotate(0deg)',
              'bgcolor': alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2)
              }
            }}
          >
            <ExpandMore />
          </IconButton>
        )}
      </Box>

      {showDescription || !isMobile ? (
        descriptionBlocks.length > 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.2),
              bgcolor: alpha(theme.palette.background.paper, 0.8)
            }}
          >
            <Box
              sx={{
                'textAlign': 'left',
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  boxShadow: theme.shadows[1]
                },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: theme.palette.primary.main,
                  fontWeight: 600
                },
                '& p': {
                  mb: 2.5,
                  lineHeight: 1.8,
                  color: alpha(theme.palette.text.primary, 0.9),
                  textAlign: 'justify'
                }
              }}
            >
              {descriptionBlocks.map((block, index) => renderDescriptionBlock(block, index))}
            </Box>
          </Paper>
        ) : (
          <Typography variant='h6' color='text.secondary'>
            Sản phẩm này chưa có thông tin mô tả chi tiết.
          </Typography>
        )
      ) : descriptionBlocks.length > 0 ? (
        <Box
          sx={{
            'p': 3,
            'borderRadius': 2,
            'border': '1px dashed',
            'borderColor': 'primary.main',
            'textAlign': 'center',
            'bgcolor': alpha(theme.palette.primary.main, 0.05),
            'cursor': 'pointer',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
          onClick={toggleDescription}
        >
          <Typography
            variant='body1'
            color='primary.main'
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontWeight: 500
            }}
          >
            <InfoOutlined /> Nhấn để xem mô tả chi tiết sản phẩm
          </Typography>
        </Box>
      ) : (
        <Typography
          variant='body1'
          sx={{
            color: alpha(theme.palette.text.secondary, 0.8),
            textAlign: 'center',
            fontStyle: 'italic',
            py: 2
          }}
        >
          Sản phẩm này chưa có thông tin mô tả chi tiết.
        </Typography>
      )}
    </Box>
  )
}
