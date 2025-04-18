'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import BackButton from '@/components/dom/BackButton'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import AudioPlayer from '@/components/dom/AudioPlayer'

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
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export default function Farralon() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !mapboxgl.accessToken) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-123.00324509041576, 37.69792596395471],
      zoom: 13,
      pitch: 50,
      antialias: true,
    })
    mapRef.current = map
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  const rootDirectory = './voiceover/split/Nelly/Nelly'
  const fileType = '.mp3'

  const dialogSteps = [
    {
      text: `Welcome to the Farallon Islands! My name is Nelly, I am your guide today.`,
      animation: 'swim',
      audioSrc: `${rootDirectory}1${fileType}`,
    },
    {
      text: `These rocky islands are also known to mariners as "The Devil's Teeth." Do you like my teeth?`,
      animation: 'bite',
      audioSrc: `${rootDirectory}2${fileType}`,
    },
    {
      text: `Due to strong winds, large swells, and thick fog, navigating these waters can be perilous; it has been linked to at least 400 ship and aircraft wrecks.`,
      animation: 'swimBite',
      audioSrc: `${rootDirectory}3${fileType}`,
    },
    {
      text: `You are lucky to be visiting; only human researchers and wildlife are allowed here.`,
      animation: 'bite',
      audioSrc: `${rootDirectory}4${fileType}`,
    },
    {
      text: `There are also a famous number of great white sharks! You should swim back to the map before I take a bigger bite.`,
      animation: 'bite',
      audioSrc: `${rootDirectory}5${fileType}`,
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
      <div ref={mapContainerRef} className='absolute left-0 top-0 z-0 size-full'></div>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <OrbitControls />
        <Shark currentAnimation={currentDialog.animation} scale={0.8} position={[0.5, 0, 0]} rotation={[0, 0, 0]} />
        <Common />
      </View>
      <BackButton />
      <SpeechBubble text={currentDialog.text} onNext={handleNextDialog} hasEnded={hasEnded} />
      <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />
    </>
  )
}
