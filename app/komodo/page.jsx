'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import BackButton from '@/components/dom/BackButton'
import SpeechBubble from '@/components/dom/SpeechBubble'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import AudioPlayer from '@/components/dom/AudioPlayer'
import { useControls } from 'leva'
import useStore from '@/store/globalStore'

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

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
export default function Komodo() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !mapboxgl.accessToken) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [119.50020430619357, -8.567272437718218],
      zoom: 12,
      pitch: 55,
      antialias: true,
    })
    mapRef.current = map

    map.on('load', () => {
      map.setFog({
        range: [-1, 2],
        'horizon-blend': 0.3,
        color: '#242B4B',
        'high-color': '#161B36',
        'space-color': '#0B1026',
        'star-intensity': 0.8,
      })

      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14,
      })

      map.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.5,
      })

      let lastTime = 0.0
      let animationTime = 0.0
      const initialBearing = map.getBearing()
      const ROTATION_SPEED = 2

      function frame(time) {
        const elapsedTime = (time - lastTime) / 1000.0
        animationTime += elapsedTime
        const rotation = initialBearing + animationTime * ROTATION_SPEED
        map.setBearing(rotation % 360)
        lastTime = time
        window.requestAnimationFrame(frame)
      }
      window.requestAnimationFrame(frame)
      // })
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  const rootDirectory = './voiceover/split/Claude/ClaudeKomodo'
  const fileType = '.mp3'
  const dialogSteps = [
    {
      text: `Hello my name is Claude, welcome to my Volcanic Island! The Komodo National Park is the home of Dragons.`,
      animation: 'flying',
      audioSrc: `${rootDirectory}1${fileType}`,
    },
    {
      text: `You might be wondering where your guide is? I imagine as a rabbit, she was worried she might be mistaken for food.`,
      animation: 'attack',
      audioSrc: `${rootDirectory}2${fileType}`,
    },
    {
      text: `You'll find around 5,700 giant "Komodo Dragons" or Varanus Komodoensis, granted I am a different kind of dragon.`,
      animation: 'hit',
      audioSrc: `${rootDirectory}3${fileType}`,
    },
    {
      text: `Komodo Dragons can grow to an average of 2-3 meters. Their bites are venomous and can be fatal to their prey. They rarely bite humans, but you may want to hurry away and not risk it.`,
      animation: 'death',
      audioSrc: `${rootDirectory}4${fileType}`,
    },
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const currentDialog = dialogSteps[currentIndex]
  const currentanimation = dialogSteps[currentIndex].animation
  const handleNextDialog = () => {
    const nextIndex = currentIndex + 1
    setCurrentIndex((prev) => Math.min(prev + 1, dialogSteps.length - 1))
    if (nextIndex === dialogSteps.length - 1) {
      setHasEnded(true)
    }
  }

  const { enablePan, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, minDistance, maxDistance } =
    useControls('orbit', {
      enablePan: true,
      // Polar angle
      minPolarAngle: { value: Math.PI / 2 - 0.1, min: 0, max: Math.PI / 2, step: 0.01 },
      maxPolarAngle: { value: Math.PI / 2 - 0.1, min: 0, max: 2, step: 0.01 },
      // Azimuth
      minAzimuthAngle: { value: -Math.PI * 0.4, min: 0, max: Math.PI / 4, step: 0.05 },
      maxAzimuthAngle: { value: Math.PI * 0.3, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
      minDistance: { value: 10, min: 1, max: 20, step: 0.01 },
      maxDistance: { value: 15, min: 1, max: 50, step: 0.01 },
    })
  const { rotationX, rotationY, rotationZ, scaleDragon, positionX, positionY, positionZ } = useControls('dragon', {
    positionX: { value: 0, min: -5, max: 5, step: 0.01 },
    positionY: { value: -1.5, min: -5, max: 5, step: 0.01 },
    positionZ: { value: 0, min: -5, max: 5, step: 0.01 },
    scaleDragon: { value: 0.8, min: -0.5, max: 1, step: 0.01 },
    rotationX: { value: 0, min: -2, max: 5, step: 0.01 },
    rotationY: { value: -0.3, min: -5, max: 5, step: 0.01 },
    rotationZ: { value: 0, min: -3, max: 4, step: 0.01 },
  })

  const userAdventureMode = useStore((state) => state.adventureMode)
  const markDestinationVisted = useStore((state) => state.markDestinationVisited)

  useEffect(() => {
    markDestinationVisted('komodo')
  }, [markDestinationVisted])

  const { audioEnabled } = useStore()

  return (
    <>
      {/* <Suspense fallback={null}> */}
      <div ref={mapContainerRef} className='absolute left-0 top-0 z-0 size-full'></div>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <directionalLight position={[5, 5, 3.5]} intensity={1.5} castShadow />
        <OrbitControls
          enablePan={enablePan}
          minPolarAngle={minPolarAngle}
          maxPolarAngle={maxPolarAngle}
          minAzimuthAngle={minAzimuthAngle}
          maxAzimuthAngle={maxAzimuthAngle}
          minDistance={minDistance}
          maxDistance={maxDistance}
        />
        <Dragon
          scale={scaleDragon}
          position={[positionX, positionY, positionZ]}
          rotation={[rotationX, -rotationY, rotationZ]}
          currentAnimation={currentanimation}
          audioEnabled={audioEnabled}
        />
        <Common />
      </View>
      {/* </Suspense> */}
      <BackButton userAdventureMode={userAdventureMode} />
      <SpeechBubble text={currentDialog.text} hasEnded={hasEnded} onNext={handleNextDialog} />
      {audioEnabled && <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />}
    </>
  )
}
