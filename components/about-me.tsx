"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Music, Pause, Play, Volume2, VolumeX, Headphones, Cloud, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import AnimatedBackground from "@/components/animated-background"

// Array of pope quotes
const popeQuotes = [
  "Faith and reason are like two wings on which the human spirit rises to the contemplation of truth. - Pope John Paul II",
  "The future starts today, not tomorrow. - Pope John Paul II",
  "To maintain a joyful family requires much from both the parents and the children. Each member of the family has to become, in a special way, the servant of the others. - Pope John Paul II",
  "Freedom consists not in doing what we like, but in having the right to do what we ought. - Pope John Paul II",
  "Do not abandon yourselves to despair. We are the Easter people and hallelujah is our song. - Pope John Paul II",
  "Darkness can only be scattered by light, hatred can only be conquered by love. - Pope John Paul II",
  "Let us remember the past with gratitude, live the present with enthusiasm, and look forward to the future with confidence. - Pope John Paul II",
  "The question confronting the Church today is not any longer whether the man in the street can grasp a religious message, but how to employ the communications media so as to let him have the full impact of the Gospel message. - Pope John Paul II",
  "It is Jesus that you seek when you dream of happiness; He is waiting for you when nothing else you find satisfies you. - Pope Benedict XVI",
  "The world offers you comfort. But you were not made for comfort. You were made for greatness. - Pope Benedict XVI",
  "Evil draws its power from indecision and concern for what other people think. - Pope Benedict XVI",
  "The happiness you have a right to enjoy has a name and a face: it is Jesus of Nazareth. - Pope Benedict XVI",
  "Each of us is the result of a thought of God. Each of us is willed, each of us is loved, each of us is necessary. - Pope Benedict XVI",
  "Let us not forget that great love has to be built on great respect. - Pope Francis",
  "A little bit of mercy makes the world less cold and more just. - Pope Francis",
  "To change the world we must be good to those who cannot repay us. - Pope Francis",
  "We must restore hope to young people, help the old, be open to the future, spread love. Be poor among the poor. We need to include the excluded and preach peace. - Pope Francis",
  "This is important: to get to know people, listen, expand the circle of ideas. The world is crisscrossed by roads that come closer together and move apart, but the important thing is that they lead towards the Good. - Pope Francis",
]

// IP-based view counter hook
function useViewCounter() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch view count from API
    async function fetchViewCount() {
      try {
        setLoading(true)
        const response = await fetch("/api/views")
        const data = await response.json()

        if (data.views !== undefined) {
          setCount(data.views)
        }
      } catch (error) {
        console.error("Failed to fetch view count:", error)
        // Fallback to localStorage if API fails
        const storedCount = Number.parseInt(localStorage.getItem("viewCount") || "0")
        setCount(storedCount)
      } finally {
        setLoading(false)
      }
    }

    fetchViewCount()
  }, [])

  return { count, loading }
}

export default function AboutMe() {
  const [activeTab, setActiveTab] = useState("about")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)
  const [duration, setDuration] = useState(0)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [currentQuote, setCurrentQuote] = useState("")
  const [isAudioPlayerExpanded, setIsAudioPlayerExpanded] = useState(false)

  // Use the view counter hook
  const { count: viewCount, loading: viewCountLoading } = useViewCounter()

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/music.mp3")
    setAudioElement(audio)

    // Set up event listeners
    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    // Set initial random quote
    setCurrentQuote(popeQuotes[Math.floor(Math.random() * popeQuotes.length)])

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", updateProgress)
    }
  }, [])

  // Change quote when tab changes
  useEffect(() => {
    setCurrentQuote(popeQuotes[Math.floor(Math.random() * popeQuotes.length)])
  }, [activeTab])

  const updateProgress = () => {
    if (audioElement) {
      setProgress((audioElement.currentTime / audioElement.duration) * 100)
    }
  }

  const togglePlay = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
      } else {
        audioElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !audioElement.muted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioElement) {
      audioElement.volume = newVolume / 100
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioElement) {
      const progressBar = e.currentTarget
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
      const percentageClicked = clickPosition / progressBar.offsetWidth
      audioElement.currentTime = percentageClicked * audioElement.duration
    }
  }

  // Enhanced animation variants for page transitions
  const pageVariants = {
    initial: (custom: string) => {
      // Different initial states based on tab direction
      if (custom === "right") {
        return { opacity: 0, x: 50 }
      } else if (custom === "left") {
        return { opacity: 0, x: -50 }
      }
      return { opacity: 0, y: 20 }
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: (custom: string) => {
      // Different exit animations based on tab direction
      if (custom === "right") {
        return {
          opacity: 0,
          x: -50,
          transition: { duration: 0.2 },
        }
      } else if (custom === "left") {
        return {
          opacity: 0,
          x: 50,
          transition: { duration: 0.2 },
        }
      }
      return {
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 },
      }
    },
  }

  // Determine animation direction based on tab change
  const getAnimationDirection = (tab: string) => {
    const tabOrder = ["about", "specs", "social"]
    const currentIndex = tabOrder.indexOf(activeTab)
    const newIndex = tabOrder.indexOf(tab)

    if (newIndex > currentIndex) return "right"
    if (newIndex < currentIndex) return "left"
    return "initial"
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Audio Player in top left */}
        <div className="fixed top-4 left-4 z-20">
          <div
            className={`bg-black/70 backdrop-blur-md rounded-lg border border-gray-700 transition-all duration-300 ${
              isAudioPlayerExpanded ? "w-64 p-3" : "w-10 h-10 p-1"
            }`}
          >
            {isAudioPlayerExpanded ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="h-8 w-8 text-white hover:text-gray-300"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="h-8 w-8 text-white hover:text-gray-300"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAudioPlayerExpanded(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>

                <div className="text-xs flex justify-between">
                  <span>{formatTime(audioElement?.currentTime || 0)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="h-1 bg-gray-700 rounded-full cursor-pointer relative" onClick={handleProgressClick}>
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-3 w-3 text-gray-400" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Music className="h-3 w-3" />
                  <span className="truncate">
                    Now Playing: my twenty first reason <Heart className="inline h-3 w-3" />
                  </span>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAudioPlayerExpanded(true)}
                className="h-8 w-8 p-0 text-white hover:text-gray-300"
              >
                <Music className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <main className="container mx-auto px-4 py-12">
          <Tabs
            defaultValue="about"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/50 backdrop-blur-md border border-gray-700">
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-lg"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-lg"
              >
                PC Specs
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-lg"
              >
                Social
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait" custom={getAnimationDirection(activeTab)}>
              <motion.div
                key={activeTab}
                custom={getAnimationDirection(activeTab)}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                <TabsContent value="about" className="mt-0">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 shadow-xl border border-gray-500/20 relative">
                    {/* View counter in top-right corner of the card */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs border border-gray-700">
                      <Eye className="h-3 w-3" />
                      <span>{viewCountLoading ? "..." : viewCount.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Fixed size profile picture container */}
                      <div className="flex-shrink-0 w-48">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-500 relative group">
                          <img
                            src="/profile.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image doesn't exist
                              e.currentTarget.src = "/placeholder.svg?height=192&width=192"
                            }}
                          />
                        </div>
                      </div>

                      {/* Content that can expand */}
                      <div className="flex-grow space-y-4">
                        <h2 className="text-3xl font-bold">zwroe</h2>
                        <p className="text-lg text-gray-300">Bot Developer/Prepaid Reseller.</p>
                        <div className="space-y-2">
                          <motion.p
                            className="text-gray-300 italic border-l-4 border-white/50 pl-4 py-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={currentQuote}
                            transition={{ duration: 0.5 }}
                          >
                            "{currentQuote}"
                          </motion.p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="mt-0">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 shadow-xl border border-gray-500/20">
                    <h2 className="text-2xl font-bold mb-6">My PC Specs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <SpecItem
                          name="CPU"
                          value="Ryzen 5 5600X"
                          details="6-Core, 12-Thread, 3.7GHz Base, 4.6GHz Boost"
                        />
                        <SpecItem name="GPU" value="NVIDIA RTX 3060" details="12GB GDDR6X" />
                        <SpecItem name="RAM" value="32GB DDR4 3200MHz" details="Dual Channel, CL16" />
                        <SpecItem name="Motherboard" value="ASROCK B450M PRO R2.0" details="MINI ATX Form Factor" />
                      </div>
                      <div className="space-y-4">
                        <SpecItem name="Storage" value="500GB NVMe SSD + 1TB INTERNAL SSD" details="PCIe Gen 4.0" />
                        <SpecItem name="PSU" value="600W 80+ Gold" details="Fully Modular" />
                        <SpecItem name="Cooling" value="Thermalright Aqua Elite 360" details="RGB Fans" />
                        <SpecItem name="Monitor" value='24.5" 1080 180Hz' details="IPS Monitor, HDR10" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="mt-0">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 shadow-xl border border-gray-500/20">
                    <h2 className="text-2xl font-bold mb-6">Connect With Me</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SocialLink
                        icon={<Github className="w-6 h-6" />}
                        name="GitHub"
                        username="zwroee"
                        url="https://github.com/zwroee"
                      />
                      <SocialLink
                        icon={<Headphones className="w-6 h-6" />}
                        name="Last.fm"
                        username="k33333333333"
                        url="https://last.fm/user/k33333333333"
                      />
                      <SocialLink
                        icon={<Cloud className="w-6 h-6" />}
                        name="SoundCloud"
                        username="zwroe"
                        url="https://soundcloud.com/zwroe"
                      />
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

interface SpecItemProps {
  name: string
  value: string
  details: string
}

function SpecItem({ name, value, details }: SpecItemProps) {
  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
      whileHover={{ x: 5 }}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{name}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="text-sm text-gray-400">{details}</div>
      <div className="h-[1px] bg-gray-700 mt-2"></div>
    </motion.div>
  )
}

interface SocialLinkProps {
  icon: React.ReactNode
  name: string
  username: string
  url: string
}

function SocialLink({ icon, name, username, url }: SocialLinkProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center p-6 rounded-lg bg-gray-900/30 hover:bg-gray-800/50 transition-colors"
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div whileHover={{ rotate: 5, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
        {icon}
      </motion.div>
      <span className="mt-2 font-medium">{name}</span>
      <span className="text-sm text-gray-400">{username}</span>
    </motion.a>
  )
}
