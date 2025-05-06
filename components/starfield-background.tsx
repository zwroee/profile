"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkleSpeed: number
  twinklePhase: number
}

export default function StarfieldBackground() {
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

    // Create stars
    const stars: Star[] = []
    const starCount = Math.min(300, window.innerWidth / 4) // Responsive star count

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.05 + 0.01,
        twinkleSpeed: Math.random() * 0.01 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    // Create a few larger stars
    for (let i = 0; i < 20; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    // Mouse position for subtle interaction
    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2
    const mouseRadius = 200

    // Track mouse position
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })

    // Time for animation
    let time = 0

    // Draw a subtle nebula/galaxy effect
    function drawNebula(ctx: CanvasRenderingContext2D) {
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, mouseRadius)

      gradient.addColorStop(0, "rgba(25, 25, 50, 0.03)")
      gradient.addColorStop(0.5, "rgba(20, 20, 40, 0.02)")
      gradient.addColorStop(1, "rgba(10, 10, 30, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Animation function
    function animate() {
      // Clear canvas with slight fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebula effect
      drawNebula(ctx)

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Update position
        star.y += star.speed

        // Wrap around when star goes off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }

        // Calculate twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        ctx.fill()

        // Draw a subtle glow for larger stars
        if (star.size > 1.5) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.1 * twinkle})`
          ctx.fill()
        }
      }

      // Occasionally add a shooting star
      if (Math.random() < 0.005) {
        drawShootingStar(ctx)
      }

      // Update time
      time += 0.01

      requestAnimationFrame(animate)
    }

    // Draw a shooting star
    function drawShootingStar(ctx: CanvasRenderingContext2D) {
      const startX = Math.random() * canvas.width
      const startY = Math.random() * (canvas.height / 3)
      const length = Math.random() * 100 + 50
      const angle = Math.PI / 4 + (Math.random() * Math.PI) / 4
      const speed = Math.random() * 5 + 5

      let progress = 0

      function animateShootingStar() {
        if (progress >= 1) return

        progress += 0.02

        const x = startX + Math.cos(angle) * length * progress
        const y = startY + Math.sin(angle) * length * progress

        // Tail
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - Math.cos(angle) * (20 * (1 - progress)), y - Math.sin(angle) * (20 * (1 - progress)))

        const gradient = ctx.createLinearGradient(x, y, x - Math.cos(angle) * 20, y - Math.sin(angle) * 20)

        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * (1 - progress)})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Head
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * (1 - progress)})`
        ctx.fill()

        if (progress < 1) {
          requestAnimationFrame(animateShootingStar)
        }
      }

      animateShootingStar()
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
      })
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
}
