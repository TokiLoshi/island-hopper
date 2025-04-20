'use client'
import SpeechBubble from '@/components/dom/SpeechBubble'
import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'

const MapboxGlobe = dynamic(() => import('@/components/canvas/PlainMapboxGlobe'), { ssr: false })
const Bunny = dynamic(() => import('@/components/canvas/Bunny').then((mod) => mod.Bunny), { ssr: false })

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })
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

export default function End() {
  const dialogSteps = [
    { text: `Thank you for joining on an adventure today! I hope you had fun`, animation: 'idleHold' },
    { text: `See you next time`, animation: 'wave' },
  ]

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentDialog = dialogSteps[currentStepIndex]
  const [hasEnded, setHasEnded] = useState(false)

  const handleNextDialogue = () => {
    const nextIndex = currentStepIndex + 1

    setCurrentStepIndex((prevIndex) => Math.min(prevIndex + 1, dialogSteps.length - 1))
    if (nextIndex === dialogSteps.length - 1) {
      setHasEnded(true)
    }
  }

  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <MapboxGlobe />
        <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <OrbitControls />

            <Bunny
              position={[-0.6, -1, 0.8]}
              scale={0.4}
              rotation={[0, 0.1, 0]}
              currentAnimation={currentDialog.animation}
            />
            <Common />
          </Suspense>
        </View>
        <SpeechBubble text={currentDialog.text} onNext={handleNextDialogue} hasEnded={hasEnded} />
      </div>
    </>
  )
}
