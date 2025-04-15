'use client'

import { OrbitControls, PresentationControls, Text } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import BackButton from '@/components/dom/BackButton'

const Sign = dynamic(() => import('@/components/canvas/Sign').then((mod) => mod.Sign), { ssr: false })
const Boombox = dynamic(() => import('@/components/canvas/Boombox').then((mod) => mod.Boombox), { ssr: false })
const Bunny = dynamic(() => import('@/components/canvas/Bunny').then((mod) => mod.Bunny), { ssr: false })
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

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function LongestPlace() {
  const first = 'Taumata­whakatangihanga­koauau­o­-'
  const second = '­tamatea­turi­pukaka­piki­maungaho-'
  const third = 'ro­nuku­pokai­whenua­ki­tana­tahu'
  const cleanedFirst = first.replace(/\u00AD/g, '')
  const cleanedSecond = second.replace(/\u00AD/g, '')
  const cleanedThird = third.replace(/\u00AD/g, '')

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !mapboxgl.accessToken) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [176.58526125541246, -40.340802662468434],
      zoom: 13,
      pitch: 60,
      antialias: true,
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  const dialogSteps = [
    { text: 'Hi, there I am Nardina, welcome to the Longest Named Place', animation: 'wave' },
    {
      text: 'Locals call this Taumata Hill, I think the full name is much more fun!',
      animation: 'jump',
    },
    { text: 'Want to hear how it is pronounced? Click on the boom box', animation: 'yes' },
    { text: 'With a total of 85 characters it is certainly quite a mouthful to say', animation: 'walk' },
    {
      text: "The name translates into 'the place where Tamatea, the man with the big knees, who slid, climbed and swallowed mountains, known as landeater, played his flute to his loved one.",
      animation: 'duck',
    },
    {
      text: 'Tamatea was a legendary chief and warrior. That is all I have for you on this hill, the longest place name in the world! Click on the world button to go back to the map and keep exploring.',
      animation: 'punch',
    },
  ]

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentDialog = dialogSteps[currentStepIndex]
  const [hasEnded, setHasEnded] = useState(false)

  const handleNextDialogue = () => {
    setCurrentStepIndex((prevIndex) => Math.min(prevIndex + 1, dialogSteps.length - 1))
    if (currentStepIndex === dialogSteps.length - 1) {
      setHasEnded(true)
    }
  }

  return (
    <>
      <div ref={mapContainerRef} className='absolute left-0 top-0 z-0 size-full'></div>
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
            onPointerEnter={() => (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => (document.body.style.cursor = 'default')}
          />
          <Bunny
            position={[-1.4, -1, 0.8]}
            scale={0.4}
            rotation={[0, 0.5, 0]}
            currentAnimation={currentDialog.animation}
          />
          <Common />
        </Suspense>
      </View>
      <BackButton />
      <SpeechBubble text={currentDialog.text} onNext={handleNextDialogue} hasEnded={hasEnded} />
    </>
  )
}
