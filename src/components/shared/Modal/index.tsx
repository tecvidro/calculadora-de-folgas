'use client'
import { CircleX } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { Box } from '../Box'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const overlay = useRef<HTMLDivElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) {
        onDismiss()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onDismiss])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss()
      }
    },
    [onDismiss]
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 z-[9999] flex h-full w-full items-center justify-center bg-gray-300/50 p-4 backdrop-blur-sm"
      exit={{ opacity: 0, y: 100 }}
      initial={{ opacity: 0 }}
      ref={overlay}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        initial={{ opacity: 0, y: 100 }}
        ref={wrapper}
      >
        <Box className="relative shadow-lg" variant="white">
          <button
            aria-label="close modal"
            className="absolute top-4 right-4 cursor-pointer text-gray-200 transition hover:scale-110 hover:text-red active:scale-90 active:text-green "
            onClick={onDismiss}
            type="button"
          >
            <CircleX />
          </button>
          <div>{children}</div>
        </Box>
      </motion.div>
    </motion.div>
  )
}
