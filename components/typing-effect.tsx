"use client"

import { useState, useEffect } from "react"

interface TypingEffectProps {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenTexts?: number
}

export default function TypingEffect({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenTexts = 2000,
}: TypingEffectProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        // Current text from the array
        const fullText = texts[currentTextIndex]

        // If deleting
        if (isDeleting) {
          setCurrentText(fullText.substring(0, currentText.length - 1))
        } else {
          // If typing
          setCurrentText(fullText.substring(0, currentText.length + 1))
        }

        // Transition logic
        if (!isDeleting && currentText === fullText) {
          // Finished typing, wait before deleting
          setTimeout(() => setIsDeleting(true), delayBetweenTexts)
        } else if (isDeleting && currentText === "") {
          // Finished deleting, move to next text
          setIsDeleting(false)
          setCurrentTextIndex((currentTextIndex + 1) % texts.length)
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => clearTimeout(timeout)
  }, [currentText, currentTextIndex, isDeleting, texts, typingSpeed, deletingSpeed, delayBetweenTexts])

  return (
    <span className="inline-block">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
