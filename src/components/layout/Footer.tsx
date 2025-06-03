'use client'

import ChatIcon from '@mui/icons-material/Chat'
import EmailIcon from '@mui/icons-material/Email'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FacebookIcon from '@mui/icons-material/Facebook'
import PhoneIcon from '@mui/icons-material/Phone'
import { Box, Button, Container, Divider, IconButton, Link, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { ReactNode, useState } from 'react'

interface FooterLinkItem {
  name: string
  url: string
}

interface FooterSectionProps {
  title: string
  children: ReactNode
  id: string
  onToggle: () => void
  isOpen: boolean
}

const FooterLink = styled(Link)(() => ({
  'color': '#333333',
  'textDecoration': 'none',
  'transition': 'all 0.2s ease',
  'display': 'flex',
  'alignItems': 'center',
  'marginBottom': '10px',
  '&:hover': {
    textDecoration: 'none',
    color: '#1976d2',
    transform: 'translateX(3px)'
  }
}))

const SectionTitle = styled(Typography)(() => ({
  'fontWeight': 700,
  'marginBottom': '20px',
  'position': 'relative',
  'color': '#333333',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 40,
    height: 2,
    backgroundColor: '#1976d2'
  }
}))

const ExpandButton = styled(Button)(() => ({
  'color': '#333333',
  'minWidth': 'auto',
  'padding': '4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  }
}))

const FooterSection = ({ title, children, id, onToggle, isOpen }: FooterSectionProps) => {
  const isMobile = useMediaQuery('(max-width:600px)')

  return (
    <Box sx={{ width: '100%', mb: { xs: 3, md: 0 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <SectionTitle variant='h6' id={id}>
          {title}
        </SectionTitle>
        {isMobile && (
          <ExpandButton onClick={onToggle} aria-expanded={isOpen} aria-controls={`${id}-content`}>
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ExpandButton>
        )}
      </Box>
      <Box
        id={`${id}-content`}
        sx={{
          display: {
            xs: isOpen ? 'block' : 'none',
            sm: 'block'
          },
          opacity: {
            xs: isOpen ? 1 : 0,
            sm: 1
          },
          height: {
            xs: isOpen ? 'auto' : '0',
            sm: 'auto'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

const Footer = () => {
  const [isQuickLinksOpen, setQuickLinksOpen] = useState(false)
  const [isPoliciesOpen, setPoliciesOpen] = useState(false)
  const [isContactOpen, setContactOpen] = useState(true)

  const quickLinks: FooterLinkItem[] = [
    { name: 'Đàn Guitar', url: '/category/guitar' },
    { name: 'Đàn Piano', url: '/category/piano' },
    { name: 'Organ & Keyboard', url: '/category/keyboard' },
    { name: 'Trống & Bộ Gõ', url: '/category/percussion' },
    { name: 'Kèn & Bộ Hơi', url: '/category/wind' }
  ]

  const policies: FooterLinkItem[] = [
    { name: 'Chính Sách Bảo Mật', url: '/policy/privacy' },
    { name: 'Chính Sách Hoàn Trả', url: '/policy/return' },
    { name: 'Chính Sách Vận Chuyển', url: '/policy/shipping' },
    { name: 'Điều Khoản Dịch Vụ', url: '/policy/terms' },
    { name: 'Tuyển Dụng', url: '/careers' }
  ]

  const toggleQuickLinks = () => setQuickLinksOpen(!isQuickLinksOpen)
  const togglePolicies = () => setPoliciesOpen(!isPoliciesOpen)
  const toggleContact = () => setContactOpen(!isContactOpen)

  return (
    <Box
      component='footer'
      sx={{
        backgroundColor: '#f9f9f9',
        color: '#333333',
        py: { xs: 5, md: 7 },
        mt: 'auto',
        borderTop: '1px solid #eaeaea'
      }}
    >
      <Container maxWidth='xl'>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 4
          }}
        >
          <Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ maxWidth: 220, mb: 2, position: 'relative', height: '60px' }}>
                <Image 
                  src='/logo.png' 
                  alt='HD Music Logo'
                  fill
                  sizes="220px"
                  priority
                  style={{ 
                    objectFit: 'contain',
                    objectPosition: 'left center'
                  }} 
                />
              </Box>
              <Typography
                variant='body2'
                sx={{
                  opacity: 0.7,
                  maxWidth: '280px',
                  lineHeight: 1.8
                }}
              >
                Chuyên cung cấp nhạc cụ chính hãng với chất lượng và dịch vụ tốt nhất
              </Typography>
            </Box>
            <FooterSection title='Thông Tin' id='company-info' isOpen={true} onToggle={() => {}}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' sx={{ mb: 1.5, lineHeight: 1.8, opacity: 0.8 }}>
                  <strong>CN1:</strong> 1061B Cách Mạng Tháng 8, P.7, Tân Bình, TP.HCM
                </Typography>
                <Typography variant='body2' sx={{ mb: 1.5, lineHeight: 1.8, opacity: 0.8 }}>
                  <strong>CN2:</strong> 290 Đường 3/2, P.12, Quận 10, TP.HCM
                </Typography>
                <Typography variant='body2' sx={{ lineHeight: 1.8, opacity: 0.8 }}>
                  <strong>Giờ làm việc:</strong> 08:00 - 20:00 (Tất cả các ngày)
                </Typography>
              </Box>
            </FooterSection>
          </Box>

          <Box>
            <FooterSection title='Liên Hệ' id='contact-info' isOpen={isContactOpen} onToggle={toggleContact}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink href='tel:+84819003282' sx={{ mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 18, color: '#1976d2' }} />
                  <Typography variant='body2'>0819 003 282</Typography>
                </FooterLink>

                <FooterLink href='mailto:info@hdmusic.vn' sx={{ mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, fontSize: 18, color: '#1976d2' }} />
                  <Typography variant='body2'>info@hdmusic.vn</Typography>
                </FooterLink>

                <FooterLink href='#' sx={{ mb: 2 }}>
                  <ChatIcon sx={{ mr: 1, fontSize: 18, color: '#1976d2' }} />
                  <Typography variant='body2'>Live chat</Typography>
                </FooterLink>

                <Box sx={{ display: 'flex', mt: 1, gap: 2 }}>
                  <IconButton size='small' aria-label='facebook' color='primary' sx={{ bgcolor: '#e3f2fd' }}>
                    <FacebookIcon fontSize='small' />
                  </IconButton>
                </Box>
              </Box>
            </FooterSection>
          </Box>

          <Box>
            <FooterSection title='Danh Mục' id='quick-links' isOpen={isQuickLinksOpen} onToggle={toggleQuickLinks}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {quickLinks.map((link, index) => (
                  <FooterLink href={link.url} key={index}>
                    <Typography variant='body2'>{link.name}</Typography>
                  </FooterLink>
                ))}
              </Box>
            </FooterSection>
          </Box>

          <Box>
            <FooterSection title='Chính Sách' id='policies' isOpen={isPoliciesOpen} onToggle={togglePolicies}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {policies.map((policy, index) => (
                  <FooterLink href={policy.url} key={index}>
                    <Typography variant='body2'>{policy.name}</Typography>
                  </FooterLink>
                ))}
              </Box>
            </FooterSection>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 2 }}>
          <Typography variant='caption' sx={{ opacity: 0.8, textAlign: { xs: 'center', sm: 'left' } }}>
            © {new Date().getFullYear()} HD Music. Đã đăng ký bản quyền.
          </Typography>
          <Typography variant='caption' sx={{ opacity: 0.8, textAlign: { xs: 'center', sm: 'right' } }}>
            Thiết kế bởi <Link href='#' color='primary' underline='hover'>Music Team</Link>
          </Typography>
        </Box>

      </Container>
    </Box>
  )
}

export default Footer
