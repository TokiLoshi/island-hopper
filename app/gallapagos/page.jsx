'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import BackButton from '@/components/dom/BackButton'

const Turtle = dynamic(() => import('@/components/canvas/Turtle').then((mod) => mod.Turtle), { ssr: false })
const Bunny = dynamic(() => import('@/components/canvas/Bunny').then((mod) => mod.Bunny), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
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
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Gallapagos() {
  const dialogSteps = [
    { text: 'text1', animation: 'wave' },
    { text: 'text2', animation: 'yes' },
    { text: 'text3', animation: 'no' },
    { text: 'text4', animation: 'yes' },
  ]
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const currentDialog = dialogSteps[currentStepIndex]
  const handleNextDialog = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, dialogSteps.length - 1))
    if (currentStepIndex === dialogSteps.length - 1) {
      setHasEnded(true)
    }
  }

  return (
    <>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <OrbitControls />
        <Turtle scale={0.08} position={[0, 0, 0]} rotation={[0, 0.8, 0]} />
        <Bunny
          position={[-1.4, -1, -0.8]}
          scale={0.4}
          rotation={[0, 0.5, 0]}
          currentAnimation={currentDialog.animation}
        />
        <Common />
      </View>
      <BackButton />
      <SpeechBubble text={currentDialog.text} onNext={handleNextDialog} hasEnded={hasEnded} />
    </>
  )
}
