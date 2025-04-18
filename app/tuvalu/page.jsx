'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import BackButton from '@/components/dom/BackButton'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Dolphin } from '@/components/canvas/Dolphin'
import AudioPlayer from '@/components/dom/AudioPlayer'

const Boat = dynamic(() => import('@/components/canvas/Boat').then((mod) => mod.Boat), { ssr: false })
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
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function Tuvalu() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (!mapboxgl.accessToken || mapRef.current || !mapContainerRef.current) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://sstyles/mapbox/satellite-streets-v12',
      center: [179.1059710111884, -8.529159314585927],
      zoom: 12,
      pitch: 50,
      antialias: true,
    })
    mapRef.current = map
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  const rootDirectory = './voiceover/split/NardinaTuvalu/NardinaTuvalu'
  const fileType = '.mp3'

  const dialogSteps = [
    {
      text: `Welcome to Tuvalu, the least-visited country in the world! We're happy you decided to visit!`,
      animation: 'wave',
      audioSrc: `${rootDirectory}1${fileType}`,
    },
    {
      text: `Tuvalu has nine islands but is tiny and collectively only covers 26 square kilometers.`,
      action: 'sword',
      audioSrc: `${rootDirectory}2${fileType}`,
    },
    {
      text: `As you can see, Tuvalu is a beautiful place but faces an existential threat.`,
      animation: 'death',
      audioSrc: `${rootDirectory}3${fileType}`,
    },
    {
      text: `The highest point is 4.6 meters above sea level, making it especially vulnerable to rising sea levels.`,
      animation: 'duck',
      audioSrc: `${rootDirectory}4${fileType}`,
    },
    {
      text: `You might have seen Tuvalu's foreign minister knee-deep in the ocean, presenting for COP26, calling for climate action.`,
      animation: 'sittingEnd',
      audioSrc: `${rootDirectory}5${fileType}`,
    },
    {
      text: ` Please keep an eye out for the pantropical spotted dolphin; it is the national animal here.`,
      animation: 'sword',
      audioSrc: `${rootDirectory}6${fileType}`,
    },
    {
      text: `When you're ready, meet me back at the map to continue exploring.`,
      animation: 'punch',
      audioSrc: `${rootDirectory}7${fileType}`,
    },
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const currentDialog = dialogSteps[currentIndex]
  const handleNextDialog = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, dialogSteps.length - 1))
    const nextIndex = currentIndex + 1
    if (nextIndex === dialogSteps.length - 1) {
      setHasEnded(true)
    }
  }
  return (
    <>
      <div ref={mapContainerRef} className='absolute left-0 top-0 z-0 size-full'></div>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <OrbitControls />
        <ambientLight intensity={1.5} />
        <Boat position={[0, -0.2, 0]} scale={0.002} rotation={[0, -0.5, 0]} />
        <Bunny
          position={[0.18, 0, 0.25]}
          scale={0.12}
          rotation={[0.2, 0, 0]}
          currentAnimation={currentDialog.animation}
        />
        <directionalLight position={[5, 5, 3.5]} intensity={1.5} castShadow />
        <Common />
        {currentIndex === dialogSteps.length - 1 && (
          <Dolphin position={[8, -4, -40]} rotation={[0, -0.1, -0.1]} scale={0.1} />
        )}
      </View>
      <BackButton />
      <SpeechBubble text={currentDialog.text} hasEnded={hasEnded} onNext={handleNextDialog} />
      <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />
    </>
  )
}
