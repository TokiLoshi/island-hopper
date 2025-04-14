'use client'

import { OrbitControls, Text } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useRef, useState } from 'react'

const Sign = dynamic(() => import('@/components/canvas/Sign').then((mod) => mod.Sign), { ssr: false })
const Boombox = dynamic(() => import('@/components/canvas/Boombox').then((mod) => mod.Boombox), { ssr: false })
const View = dynamic(() =>
  import('@/components/canvas/View').then((mod) => mod.View, {
    ssr: false,
    loading: () => (
      <div className='flex h-96 w-full flex-col items-center justify-center'>
        <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      </div>
    ),
  }),
)

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function LongestPlace() {
  const first = 'Taumata­whakatangihanga­koauau­o­-'
  const second = '­tamatea­turi­pukaka­piki­maungaho-'
  const third = 'ro­nuku­pokai­whenua­ki­tana­tahu'
  const cleanedFirst = first.replace(/\u00AD/g, '')
  const cleanedSecond = second.replace(/\u00AD/g, '')
  const cleanedThird = third.replace(/\u00AD/g, '')
  // const [intro] = useState(() => new Audio('./voiceover.wav'))
  // const [hitSound] = useState(() => new Audio('./voiceover.mp3'))
  const [introAudio, setIntroAudio] = useState(null)
  const boomRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/voiceover.wav')
      audio.preload = 'auto'
      setIntroAudio(audio)
      const handleEnded = () => setIsPlaying(false)
      audio.addEventListener('ended', handleEnded)

      return () => {
        audio.pause()
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  const handleBoomboxClick = (event) => {
    event.stopPropagation()
    if (!introAudio) {
      return
    }
    if (isPlaying) {
      introAudio.pause()

      setIsPlaying(false)
    } else {
      introAudio.play().catch((error) => {
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  return (
    <>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <Suspense fallback={null}>
          <OrbitControls />
          <group>
            <Text color='whitesmoke' anchorX='center' anchorY='middle' fontSize='0.11' position={[0, 1, 0.02]}>
              {cleanedFirst}
            </Text>
            <Text color='whitesmoke' anchorX='center' anchorY='middle' fontSize='0.11' position={[0, 0.8, 0.02]}>
              {cleanedSecond}
            </Text>
            <Text color='whitesmoke' anchorX='center' anchorY='middle' fontSize='0.11' position={[0, 0.6, 0.02]}>
              {cleanedThird}
            </Text>
          </group>
          <Sign position={[0, -0.5, 0]} scale={0.75} />
          <Boombox
            scale={0.2}
            position={[1.29, -0.5, 0]}
            rotation={[0, -0.5, 0]}
            ref={boomRef}
            onClick={handleBoomboxClick}
            onPointerEnter={() => (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => (document.body.style.cursor = 'default')}
          />
        </Suspense>
        <Common />
      </View>
    </>
  )
}
