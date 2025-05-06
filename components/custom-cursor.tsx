"use client"

import { useState, useEffect } from "react"

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hidden, setHidden] = useState(true)
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)

  useEffect(() => {
    // Only show cursor when mouse moves
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseenter", onMouseEnter)
      document.addEventListener("mouseleave", onMouseLeave)
      document.addEventListener("mousedown", onMouseDown)
      document.addEventListener("mouseup", onMouseUp)
    }

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const onMouseEnter = () => {
      setHidden(false)
    }

    const onMouseLeave = () => {
      setHidden(true)
    }

    const onMouseDown = () => {
      setClicked(true)
    }

    const onMouseUp = () => {
      setClicked(false)
    }

    // Check for hoverable elements
    const handleLinkHoverEvents = () => {
      document.querySelectorAll("a, button, [role=button], .hoverable").forEach((el) => {
        el.addEventListener("mouseenter", () => setLinkHovered(true))
        el.addEventListener("mouseleave", () => setLinkHovered(false))
      })
    }

    // Add event listeners
    addEventListeners()
    handleLinkHoverEvents()

    // Add a mutation observer to handle dynamically added elements
    const observer = new MutationObserver(handleLinkHoverEvents)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      removeEventListeners()
      observer.disconnect()
    }
  }, [])

  // Don't render on server or if cursor is hidden
  if (typeof window === "undefined") return null

  return (
    <>
      <div
        className={`custom-cursor ${hidden ? "opacity-0" : "opacity-100"} ${linkHovered ? "cursor-grow" : ""} ${clicked ? "scale-90" : ""}`}
        style={{
          transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
          backgroundColor: clicked ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
      />
      <div
        className={`custom-cursor-dot ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{
          transform: `translate(${position.x - 2.5}px, ${position.y - 2.5}px)`,
        }}
      />
    </>
  )
}
