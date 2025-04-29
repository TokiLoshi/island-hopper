'use client'
import { useState, useRef, useEffect } from 'react'
import { Play, CirclePause } from 'lucide-react'
import useStore from '@/store/globalStore'

export default function AudioPlayer({ audioFilePath, autoPlay = true, initialDelay = 0 }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const initialPlayTimeoutRef = useRef(null)
  const hasAttemptedInitialPlayRef = useRef(false)
  const audioRef = useRef(null)
  const previousAudioPathRef = useRef('')
  const { dialogAudioPlaying, setDialogAudioPlaying } = useStore()

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
      setDialogAudioPlaying(true)
      audioRef.current.play().catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error playing audio: ', error)
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
      setDialogAudioPlaying(false)
    }
  }, [isPlaying, isReady, setDialogAudioPlaying])

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
        className='fixed bottom-4 right-4 z-50 m-2 cursor-pointer rounded-full bg-black p-2 text-white md:bottom-8 md:right-8 lg:bottom-20 lg:right-20'
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
