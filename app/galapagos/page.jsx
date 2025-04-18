'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import BackButton from '@/components/dom/BackButton'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import AudioPlayer from '@/components/dom/AudioPlayer'

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
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function Gallapagos() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !mapboxgl.accessToken) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-91.4934201703237, -0.8817195536941],
      //-0.304800, -90.581085
      // center: [-90.581085, -0.3048],
      zoom: 11,
      pitch: 60,
      antialias: true,
    })
    mapRef.current = map
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  const rootDirectory = `./voiceover/split/NardinaGalapagos/NardinaGalapagos`
  const fileType = '.mp3'

  const dialogSteps = [
    {
      text: `Welcome to the Galapagos, a volcanic archipelago filled with amazing animals you would be lucky to see!`,
      animation: 'wave',
      audioSrc: `${rootDirectory}1${fileType}`,
    },
    {
      text: `These magical Islands are home to giant Tortoises just like this one.`,
      animation: 'yes',
      audioSrc: `${rootDirectory}2${fileType}`,
    },
    {
      text: `Benardo here, like a few others, is almost a century old!`,
      animation: 'sittingEating',
      audioSrc: `${rootDirectory}3${fileType}`,
    },
    {
      text: `Fun fact: this international UNESCO Heritage site also inspired Darwin's theory of evolution.`,
      animation: 'panLoop',
      audioSrc: `${rootDirectory}4${fileType}`,
    },
    {
      text: `I can't get enough of hanging out with these creatures, but I'm ready to return to the map when you are.`,
      animation: 'punch',
      audioSrc: `${rootDirectory}5${fileType}`,
    },
  ]
  const [currentIndex, setCurrentStepIndex] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const currentDialog = dialogSteps[currentIndex]

  const handleNextDialog = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, dialogSteps.length - 1))
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
        <Turtle scale={0.08} position={[0.5, 0.5, 0]} rotation={[0, 0.8, 0]} />
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
      <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />
    </>
  )
}
