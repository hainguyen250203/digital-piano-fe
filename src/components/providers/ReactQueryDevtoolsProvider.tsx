'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useState } from 'react'

export default function ReactQueryDevtoolsProvider() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render DevTools on the client side
  if (!mounted) return null

  return (
    <ReactQueryDevtools initialIsOpen={false} />
  )
} 