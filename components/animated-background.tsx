"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Wave parameters
    const waves = [
      { amplitude: 50, frequency: 0.01, speed: 0.01, opacity: 0.2 },
      { amplitude: 30, frequency: 0.02, speed: 0.015, opacity: 0.15 },
      { amplitude: 20, frequency: 0.03, speed: 0.02, opacity: 0.1 },
    ]

    let time = 0

    // Animation loop
    function animate() {
      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw waves
      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude + canvas.height / 2
          ctx.lineTo(x, y)
        }

        // Complete the wave path
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${wave.opacity * 0.5})`)
        gradient.addColorStop(0.5, `rgba(200, 200, 200, ${wave.opacity})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, ${wave.opacity * 0.5})`)

        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Update time
      time += 0.05

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
}
