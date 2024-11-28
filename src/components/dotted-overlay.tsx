'use client'

import React, { useEffect, useRef } from 'react'

export function DottedOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawDots = () => {
      if (!canvas || !ctx) return
      
      timeRef.current += 0.5
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const spacing = 20
      const rows = Math.ceil(canvas.height / spacing)
      const cols = Math.ceil(canvas.width / spacing)

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * spacing
          const y = i * spacing

          const distanceFromCenter = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) + 
            Math.pow(y - canvas.height / 2, 2)
          )

          const hue = (distanceFromCenter * 0.1 + timeRef.current) % 360
          const saturation = 70
          const lightness = 50

          const wave = Math.sin(distanceFromCenter * 0.02 - timeRef.current * 0.02)
          const opacity = (wave + 1) * 0.15

          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameRef.current = requestAnimationFrame(drawDots)
    }

    animationFrameRef.current = requestAnimationFrame(drawDots)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

export function DottedOverlayProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DottedOverlay />
    </>
  )
}