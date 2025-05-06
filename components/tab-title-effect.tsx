"use client"

import { useEffect, useState } from "react"

export default function TabTitleEffect({ texts = ["zwroe", "⚡", "Bot Developer", "Prepaid Reseller"] }) {
  const [titleIndex, setTitleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [text, setText] = useState("")

  useEffect(() => {
    const typeSpeed = 150
    const deleteSpeed = 75
    const delayBetweenTexts = 2000

    const type = () => {
      const currentText = texts[titleIndex]

      if (isDeleting) {
        // Deleting text
        setText(currentText.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)

        if (charIndex <= 1) {
          setIsDeleting(false)
          setTitleIndex((prev) => (prev + 1) % texts.length)
        }
      } else {
        // Typing text
        setText(currentText.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)

        if (charIndex >= currentText.length) {
          setIsDeleting(true)
          setTimeout(() => {}, delayBetweenTexts)
        }
      }
    }

    const timer = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed)

    // Update document title
    document.title = text || "zwroe"

    return () => clearTimeout(timer)
  }, [text, charIndex, isDeleting, titleIndex, texts])

  return null
}
