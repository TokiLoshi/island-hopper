'use client'

import { useState, useRef, useEffect } from 'react'
import useStore from '@/store/globalStore'
import { Volume1, VolumeOff } from 'lucide-react'

export default function SoundEffectAudio({ audioFilePath }) {
  const { backgroundMusicEnabled, setBackgroundMusicEnabled } = useStore()
  const { adventureMode } = useStore()

  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isReady, setIsReady] = useState(false)

  // Handle readiness and loading
  useEffect(() => {
    if (!audioFilePath) {
      // eslint-disable-next-line no-console
      console.warn('Improper audio file path: ', audioFilePath)
      return null
    }

    const audio = new Audio(audioFilePath)
    audioRef.current = audio
    audio.volume = 1.0

    const handleCanPlayThrough = () => {
      setIsReady(true)
    }

    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    audio.load()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough)
      }
    }
  }, [audioFilePath])

  // Play vs pause
  useEffect(() => {
    if (!audioRef.current || !isReady) return

    if (backgroundMusicEnabled !== isPlaying) {
      setIsPlaying(backgroundMusicEnabled)
    }

    if (isPlaying) {
      const playDelay = setTimeout(() => {
        audioRef.current.play().catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error playing audio: ', error)
          setIsPlaying(false)
          setBackgroundMusicEnabled(false)
        })
      }, 1500)
      return () => clearTimeout(playDelay)
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, isReady, backgroundMusicEnabled, audioFilePath, setBackgroundMusicEnabled])

  useEffect(() => {
    if (!audioRef.current || !audioFilePath) return
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

    const newPlayingState = !isPlaying

    setIsPlaying(newPlayingState)
    setBackgroundMusicEnabled(newPlayingState)

    if (audioRef.current && isReady) {
      if (newPlayingState) {
        audioRef.current.play().catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Something went wrong: ', error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }

  return (
    <div
      onClick={togglePlayPause}
      className='fixed left-4 top-4 z-50 m-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-slate-800 text-white transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg md:left-8 md:top-8 lg:left-20 lg:top-20'
      style={{
        //   width: '50px',
        //   height: '50px',
        //   display: 'flex',
        //   alignItems: 'center',
        //   justifyContent: 'center',
        touchAction: 'manipulation',
      }}
    >
      {isPlaying ? <Volume1 size={24} color='white' /> : <VolumeOff size={24} color='white' />}
    </div>
  )
}
