'use client'
import { useState, useRef, useEffect } from 'react'
import { Play, CirclePause } from 'lucide-react'

export default function AudioPlayer({ audioFilePath, autoPlay = true, initialDelay = 0 }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const initialPlayTimeoutRef = useRef(null)
  const hasAttemptedInitialPlayRef = useRef(false)
  const audioRef = useRef(null)
  const previousAudioPathRef = useRef('')

  // Reset state when audio file changes
  useEffect(() => {
    if (previousAudioPathRef.current !== audioFilePath) {
      setIsPlaying(false)
      setIsReady(false)
      hasAttemptedInitialPlayRef.current = false

      previousAudioPathRef.current = audioFilePath
    }
  }, [audioFilePath])

  // Handle Loading and Readiness
  useEffect(() => {
    if (!audioFilePath) {
      // eslint-disable-next-line no-console
      console.warn('No Audio provided: ')
      return
    }

    const audio = new Audio(audioFilePath)
    audioRef.current = audio

    const handleCanPlayThrough = () => {
      setIsReady(true)
    }

    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    audio.load()

    return () => {
      if (initialPlayTimeoutRef.current) {
        clearTimeout(initialPlayTimeoutRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough)
      }
    }
  }, [audioFilePath])

  // Handle Playing or Pausing the Audio status
  useEffect(() => {
    if (!audioRef.current || !isReady) return

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error playing audio: ', error)
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, isReady])

  // Handle Delaying the audio
  useEffect(() => {
    if (!audioRef.current || !isReady || !autoPlay || hasAttemptedInitialPlayRef.current) return

    hasAttemptedInitialPlayRef.current = true

    if (initialDelay > 0) {
      initialPlayTimeoutRef.current = setTimeout(() => {
        setIsPlaying(true)
      }, initialDelay)
    } else {
      setIsPlaying(true)
    }
    return () => {
      if (initialPlayTimeoutRef.current) {
        clearTimeout(initialPlayTimeoutRef.current)
      }
    }
  }, [autoPlay, initialDelay, isReady])

  // Handle the end of the audio
  useEffect(() => {
    if (!audioRef.current) return
    const handleEndAudio = () => {
      setIsPlaying(false)
    }
    audioRef.current.addEventListener('ended', handleEndAudio)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEndAudio)
      }
    }
  }, [audioFilePath])

  const togglePlayPause = (event) => {
    event.stopPropagation()
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <div
        onClick={togglePlayPause}
        // className='fixed z-50 bottom-4 right-4 m-2 p-2 rounded-full bg-black text-white cursor-pointer md:bottom-8 md:right-8 lg:bottom-20 lg:right-20'
        className='fixed z-50 m-2 cursor-pointer rounded-full bg-black p-2 text-white bottom-4 right-4 md:bottom-8 md:right-8 lg:bottom-20 lg:right-20'
        style={{
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'manipulation',
        }}
      >
        {isPlaying ? <CirclePause size={24} color='white' /> : <Play size={24} color='white' />}
      </div>
    </>
  )
}

// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { Play, CirclePause } from 'lucide-react'

// export default function AudioPlayer({ audioFilePath, autoPlay = true, initialDelay = 0 }) {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isReady, setIsReady] = useState(false)
//   const initialPlayTimeoutRef = useRef(null)
//   const hasAttemptedInitialPlayRef = useRef(false)
//   const audioRef = useRef(null)
//   const previousAudioPathRef = useRef('')

//   // Preload the next audio instance to reduce delay
//   const nextAudioRef = useRef(null)

//   // Reset state when audio file changes
//   useEffect(() => {
//     if (previousAudioPathRef.current !== audioFilePath) {
//       // Check if we have a preloaded instance for this path
//       if (nextAudioRef.current && nextAudioRef.current.src.endsWith(audioFilePath.split('/').pop())) {
//         // Use the preloaded audio instance
//         if (audioRef.current) {
//           audioRef.current.pause()
//         }
//         audioRef.current = nextAudioRef.current
//         nextAudioRef.current = null
//         setIsReady(true)
//       } else {
//         // No preloaded instance, reset normally
//         setIsPlaying(false)
//         setIsReady(false)
//         hasAttemptedInitialPlayRef.current = false
//       }

//       previousAudioPathRef.current = audioFilePath
//     }
//   }, [audioFilePath])

//   // Handle Loading and Readiness
//   useEffect(() => {
//     if (!audioFilePath) {
//       console.warn('No Audio provided')
//       return
//     }

//     // Only create a new audio instance if we don't already have one
//     if (!audioRef.current || !audioRef.current.src.endsWith(audioFilePath.split('/').pop())) {
//       const audio = new Audio(audioFilePath)
//       audioRef.current = audio

//       // Set audio to preload as soon as metadata is loaded
//       audio.preload = 'auto'

//       const handleCanPlayThrough = () => {
//         setIsReady(true)
//       }

//       audio.addEventListener('canplaythrough', handleCanPlayThrough)

//       // Load the audio
//       audio.load()

//       return () => {
//         if (initialPlayTimeoutRef.current) {
//           clearTimeout(initialPlayTimeoutRef.current)
//         }
//         if (audioRef.current) {
//           audioRef.current.pause()
//           audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough)
//         }
//       }
//     }
//   }, [audioFilePath])

//   // Preload the next audio when current is playing (optional feature)
//   const preloadNextAudio = (nextPath) => {
//     if (!nextPath) return

//     const nextAudio = new Audio(nextPath)
//     nextAudio.preload = 'auto'
//     nextAudio.load()
//     nextAudioRef.current = nextAudio
//   }

//   // Handle Playing or Pausing the Audio status
//   useEffect(() => {
//     if (!audioRef.current || !isReady) return

//     if (isPlaying) {
//       // Reset time to beginning if the audio has ended
//       if (audioRef.current.ended) {
//         audioRef.current.currentTime = 0
//       }

//       const playPromise = audioRef.current.play()

//       if (playPromise !== undefined) {
//         playPromise.catch((error) => {
//           console.error('Error playing audio: ', error)
//           setIsPlaying(false)
//         })
//       }
//     } else {
//       audioRef.current.pause()
//     }
//   }, [isPlaying, isReady])

//   // Handle Delaying the audio
//   useEffect(() => {
//     if (!audioRef.current || !isReady || !autoPlay || hasAttemptedInitialPlayRef.current) return

//     hasAttemptedInitialPlayRef.current = true

//     if (initialDelay > 0) {
//       initialPlayTimeoutRef.current = setTimeout(() => {
//         setIsPlaying(true)
//       }, initialDelay)
//     } else {
//       setIsPlaying(true)
//     }

//     return () => {
//       if (initialPlayTimeoutRef.current) {
//         clearTimeout(initialPlayTimeoutRef.current)
//       }
//     }
//   }, [autoPlay, initialDelay, isReady])

//   // Handle the end of the audio with reduced delay for replay
//   useEffect(() => {
//     if (!audioRef.current) return

//     const handleEndAudio = () => {
//       // Instead of immediately setting to false, prepare for replay
//       audioRef.current.currentTime = 0
//       setIsPlaying(false)
//     }

//     audioRef.current.addEventListener('ended', handleEndAudio)

//     return () => {
//       if (audioRef.current) {
//         audioRef.current.removeEventListener('ended', handleEndAudio)
//       }
//     }
//   }, [audioFilePath])

//   const togglePlayPause = (event) => {
//     event.stopPropagation()

//     if (!isPlaying && audioRef.current && audioRef.current.ended) {
//       // Reset position if ended
//       audioRef.current.currentTime = 0
//     }

//     setIsPlaying(!isPlaying)
//   }

//   return (
//     <>
//       <div
//         onClick={togglePlayPause}
//         className='fixed z-50 m-2 cursor-pointer rounded-full bg-black p-2 text-white bottom-4 right-4 md:bottom-8 md:right-8 lg:bottom-20 lg:right-20'
//         style={{
//           width: '50px',
//           height: '50px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           touchAction: 'manipulation',
//         }}
//       >
//         {isPlaying ? <CirclePause size={24} color='white' /> : <Play size={24} color='white' />}
//       </div>
//     </>
//   )
// }
