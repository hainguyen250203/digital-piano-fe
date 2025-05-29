import { Box, Paper } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'

interface ProductImage {
  id: string
  url: string
}

interface ProductGalleryProps {
  images: ProductImage[]
  defaultImage: ProductImage | null
  videoUrl?: string | null
  productName: string
}

export default function ProductGallery({ images, defaultImage, videoUrl, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(defaultImage?.url || null)
  const [isVideoSelected, setIsVideoSelected] = useState(videoUrl ? true : false)
  
  const displayImage = selectedImage || defaultImage?.url || '/placeholder-image.jpg'

  // Logic for handling images
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsVideoSelected(false)
  }

  // Logic for handling video selection
  const handleVideoSelect = () => {
    setIsVideoSelected(true)
    setSelectedImage(null)
  }

  function getVideoId(url: string): string | null {
    const match = url.match(/youtube\.com\/watch\?v=([^?]+)/)
    if (match) {
      return match[1]
    }
    return null
  }

  return (
    <Box>
      {/* Main Image or Video */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, sm: 400, md: 500 },
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {isVideoSelected && videoUrl ? (
          <Box sx={{ width: '100%', height: '100%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${getVideoId(videoUrl)}`}
              title={`${productName} - Video`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              loading='lazy'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </Box>
        ) : (
          <Image
            src={displayImage}
            alt={productName}
            fill
            priority
            sizes='(max-width: 768px) 100vw, 50vw'
            style={{
              objectFit: 'contain',
              backgroundColor: '#ffffff',
              padding: '1rem'
            }}
          />
        )}
      </Paper>

      {/* Thumbnail Images */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 1,
          pt: 1,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            height: { xs: 4, md: 6 }
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 3
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        }}
      >
        {/* YouTube Video thumbnail */}
        {videoUrl && (
          <Box
            sx={{
              width: { xs: 70, sm: 80 },
              height: { xs: 70, sm: 80 },
              minWidth: { xs: 70, sm: 80 },
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              border: isVideoSelected ? '2px solid #f44336' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `url(${`https://img.youtube.com/vi/${getVideoId(videoUrl)}/hqdefault.jpg`})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 1,
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}
            onClick={handleVideoSelect}
          >
            <Box
              sx={{
                width: { xs: 24, sm: 30 },
                height: { xs: 24, sm: 30 },
                bgcolor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderTop: { xs: '5px solid transparent', sm: '6px solid transparent' },
                  borderBottom: { xs: '5px solid transparent', sm: '6px solid transparent' },
                  borderLeft: { xs: '8px solid #f44336', sm: '10px solid #f44336' },
                  ml: 0.5
                }}
              />
            </Box>
          </Box>
        )}

        {/* Default image thumbnail */}
        {defaultImage && (
          <Box
            onClick={() => handleImageSelect(defaultImage.url)}
            sx={{
              width: { xs: 70, sm: 80 },
              height: { xs: 70, sm: 80 },
              minWidth: { xs: 70, sm: 80 },
              position: 'relative',
              cursor: 'pointer',
              border: theme =>
                !isVideoSelected && (selectedImage === defaultImage.url || (!selectedImage && defaultImage))
                  ? `2px solid ${theme.palette.primary.main}`
                  : '2px solid transparent',
              borderRadius: 1,
              scrollSnapAlign: 'start',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            <Image 
              src={defaultImage.url} 
              alt={`${productName}`} 
              fill 
              sizes='80px' 
              style={{ 
                objectFit: 'contain', 
                padding: '0.5rem', 
                backgroundColor: '#ffffff' 
              }} 
            />
          </Box>
        )}

        {/* Additional images thumbnails */}
        {images?.map((image, index) => {
          if (image.id === defaultImage?.id) return null
          return (
            <Box
              key={image.id}
              onClick={() => handleImageSelect(image.url)}
              sx={{
                width: { xs: 70, sm: 80 },
                height: { xs: 70, sm: 80 },
                minWidth: { xs: 70, sm: 80 },
                position: 'relative',
                cursor: 'pointer',
                border: theme => (!isVideoSelected && selectedImage === image.url ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent'),
                borderRadius: 1,
                scrollSnapAlign: 'start',
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
              <Image 
                src={image.url} 
                alt={`${productName} - ${index + 1}`} 
                fill 
                sizes='80px' 
                style={{ 
                  objectFit: 'contain', 
                  padding: '0.5rem', 
                  backgroundColor: '#ffffff' 
                }} 
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
} 