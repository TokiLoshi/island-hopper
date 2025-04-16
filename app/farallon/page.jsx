'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import BackButton from '@/components/dom/BackButton'

const Shark = dynamic(() => import('@/components/canvas/Shark').then((mod) => mod.Shark), { ssr: false })
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

export default function Farralon() {
  const dialogSteps = [
    {
      text: 'Welcome to the Farallon Islands! My name is Nelly, I am your guide today.',
      animation: 'swim',
    },
    {
      text: 'These rocky Islands are also known to Mariners as "The Devil`s Teeth." Do you like my teeth?',
      animation: 'bite',
    },
    {
      text: 'Between the strong winds, huge swells and dense fog it`s been a pretty dangerous place, blamed for at least 400 ship and aircraft wrecks',
      animation: 'swimBite',
    },
    { text: 'You are lucky to be visiting, only human researchers and wildlife are allowed here.', animation: 'bite' },
    {
      text: 'There are also a famous number of great white sharks! You might want to swim away back to the map now, before I take a bigger bite',
      animation: 'bite',
    },
  ]
  const [currentIndex, setCurrentStepIndex] = useState(0)
  const currentDialog = dialogSteps[currentIndex]
  const [hasEnded, setHasEnded] = useState(false)
  const handleNextDialog = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, dialogSteps.length - 1))
    const nextIndex = currentIndex + 1
    if (nextIndex === dialogSteps.length - 1) {
      setHasEnded(true)
    }
  }
  return (
    <>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <OrbitControls />
        <Shark currentAnimation={currentDialog.animation} />
        <Common />
      </View>
      <BackButton />
      <SpeechBubble text={currentDialog.text} onNext={handleNextDialog} hasEnded={hasEnded} />
    </>
  )
}
