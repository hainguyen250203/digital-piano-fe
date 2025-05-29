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
          <Typography key={index} variant='h6' fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            {block.content}
          </Typography>
        )
      case 'paragraph':
        return (
          <Typography key={index} variant='body1' sx={{ mb: 2, lineHeight: 1.8 }}>
            {block.content}
          </Typography>
        )
      case 'specs':
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Box component='ul' sx={{ pl: 3 }}>
              {block.content.map((spec, i) => (
                <Typography component='li' key={i} variant='body2' sx={{ mb: 0.5 }}>
                  {spec}
                </Typography>
              ))}
            </Box>
          </Box>
        )
      case 'image':
        return (
          <Box key={index} sx={{ my: 2, position: 'relative', height: 300, borderRadius: 1, overflow: 'hidden' }}>
            <Image src={block.content.src} alt={block.content.alt} fill style={{ objectFit: 'contain' }} />
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
          borderBottom: '1px solid',
          borderColor: '#0000001f'
        }}
      >
        <Typography variant='h5' fontWeight={700} color='primary.main' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: '#0000001f'
          }}
        >
          {descriptionBlocks.length > 0 ? (
            <Box
              sx={{
                'textAlign': 'left',
                '& img': { maxWidth: '100%', height: 'auto' },
                '& h1, & h2, & h3, & h4, & h5, & h6': { color: theme.palette.text.primary },
                '& p': { mb: 2, lineHeight: 1.7, color: alpha(theme.palette.text.primary, 0.9) }
              }}
            >
              {descriptionBlocks.map((block, index) => renderDescriptionBlock(block, index))}
            </Box>
          ) : (
            <Typography variant='body1' sx={{ color: alpha(theme.palette.text.primary, 0.8) }}>
              {description || 'Không có thông tin mô tả.'}
            </Typography>
          )}
        </Paper>
      ) : (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            textAlign: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            cursor: 'pointer'
          }}
          onClick={toggleDescription}
        >
          <Typography color='text.secondary' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <InfoOutlined fontSize='small' /> Nhấn để xem mô tả chi tiết sản phẩm
          </Typography>
        </Box>
      )}
    </Box>
  )
}
