'use client'

import StarterSpeech from '@/components/dom/StarterSpeech'
import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { useControls } from 'leva'
import AudioPlayer from '@/components/dom/AudioPlayer'

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

const rootDirectory = './voiceover/split/StartSpeech/Starter'
const fileType = '.mp3'

export default function Page() {
  const dialogSteps = [
    {
      text: `Welcome to Island Hopper! I'm Nardina, and I'll be your guide today!`,
      animation: 'wave',
      audioSrc: `${rootDirectory}1${fileType}`,
    },
    {
      text: `Together, we'll explore interesting places and meet unique characters.`,
      animation: 'yes',
      audioSrc: `${rootDirectory}2${fileType}`,
    },
    {
      text: `Would you like to choose your path or follow me on a guided tour?`,
      animation: 'idleHolding',
      audioSrc: `${rootDirectory}3${fileType}`,
    },
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

  const { enablePan, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, minDistance, maxDistance } =
    useControls('orbit', {
      enablePan: true,
      // Polar angle
      minPolarAngle: { value: 0.91, min: 0, max: Math.PI / 2, step: 0.01 },
      maxPolarAngle: { value: Math.PI / 2 - 0.1, min: 0, max: 2, step: 0.01 },
      // Azimuth
      minAzimuthAngle: { value: -1, min: -1, max: Math.PI / 4, step: 0.05 },
      maxAzimuthAngle: { value: 0.94, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
      minDistance: { value: 7, min: 1, max: 10, step: 0.01 },
      maxDistance: { value: 17, min: 1, max: 50, step: 0.01 },
    })

  const { rotationX, rotationY, rotationZ, scale, positionX, positionY, positionZ } = useControls('volcano', {
    positionX: { value: -1.1, min: -5, max: 5, step: 0.01 },
    positionY: { value: -1, min: -5, max: 5, step: 0.01 },
    positionZ: { value: 0.8, min: -5, max: 5, step: 0.01 },
    scale: { value: 0.4, min: -0.5, max: 1, step: 0.01 },
    rotationX: { value: 0, min: -2, max: 5, step: 0.01 },
    rotationY: { value: 0.1, min: -5, max: 5, step: 0.01 },
    rotationZ: { value: 0, min: -3, max: 4, step: 0.01 },
  })

  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <MapboxGlobe />
        <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <OrbitControls
              enablePan={enablePan}
              minPolarAngle={minPolarAngle}
              maxPolarAngle={maxPolarAngle}
              minAzimuthAngle={minAzimuthAngle}
              maxAzimuthAngle={maxAzimuthAngle}
              minDistance={minDistance}
              maxDistance={maxDistance}
            />

            <Bunny
              position={[positionX, positionY, positionZ]}
              scale={scale}
              rotation={[rotationX, rotationY, rotationZ]}
              currentAnimation={currentDialog.animation}
            />
            <Common />
          </Suspense>
        </View>
        <StarterSpeech text={currentDialog.text} onNext={handleNextDialogue} hasEnded={hasEnded} />
        <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />
      </div>
    </>
  )
}
