'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { Suspense, useState } from 'react'
import BackButton from '@/components/dom/BackButton'
import SpeechBubble from '@/components/dom/SpeechBubble'

const Dragon = dynamic(() => import('@/components/canvas/Dragon').then((mod) => mod.Dragon), { ssr: false })
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

export default function Komodo() {
  const dialogSteps = [{ text: 'text1' }, { text: 'text2' }, { text: 'text3' }]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const currentDialog = dialogSteps[currentIndex]
  const handleNextDialog = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, dialogSteps.length - 1))
    if (currentIndex === dialogSteps.length - 1) {
      setHasEnded(true)
    }
  }

  return (
    <>
      {/* <Suspense fallback={null}> */}
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <directionalLight position={[5, 5, 3.5]} intensity={1.5} castShadow />
        <OrbitControls />
        <Dragon scale={0.5} position={[0, -1, 0]} rotation={[0, -0.3, 0]} />
        <Common />
      </View>
      {/* </Suspense> */}
      <BackButton />
      <SpeechBubble text={currentDialog.text} hasEnded={hasEnded} onNext={handleNextDialog} />
    </>
  )
}
