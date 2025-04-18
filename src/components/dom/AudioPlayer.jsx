'use client'
import { useState, useRef, useEffect } from 'react'
import { Play, CirclePause } from 'lucide-react'

export default function AudioPlayer({ audioFilePath, autoPlay = true, initialDelay = 0 }) {
  // eslint-disable-next-line no-console
  console.log(`File to play: ${audioFilePath}`)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const initialPlayTimeoutRef = useRef(null)
  const hasAttemptedInitialPlayRef = useRef(null)
  const audioRef = useRef(null)
  let previousAudioPathRef = useRef('')

  // Reset state when audio file changes
  useEffect(() => {
    if (previousAudioPathRef.current !== audioFilePath) {
      setIsPlaying(false)
      setIsReady(false)
      hasAttemptedInitialPlayRef.current = false

      previousAudioPathRef = audioFilePath
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
      // eslint-disable-next-line no-console
      console.log('track ended')
      setIsPlaying(false)
    }
    audioRef.current.addEventListener('ended', handleEndAudio)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEndAudio)
      }
    }
  }, [])

  const togglePlayPause = (event) => {
    event.stopPropagation()
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <div
        onClick={togglePlayPause}
        className='cursor-pointer bg-black text-white p-2 m-2 rounded-full fixed bottom-20 right-60 z-50'
        style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isPlaying ? <CirclePause size={24} color='white' /> : <Play size={24} color='white' />}
      </div>
    </>
  )
}
