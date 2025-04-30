'use client'

import { Caustics, OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import BackButton from '@/components/dom/BackButton'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import AudioPlayer from '@/components/dom/AudioPlayer'
import { useControls } from 'leva'
import useStore from '@/store/globalStore'
import Shark from '@/components/canvas/Shark'
import { Perf } from 'r3f-perf'

const BubbleSystem = dynamic(() => import('@/components/canvas/BubbleSystem'), {
  ssr: false,
})
// const Bubble = dynamic(() => import('@/components/canvas/Bubble').then((mod) => mod.Bubble), { ssr: false })
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
  const sharkRef = useRef()

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !mapboxgl.accessToken) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-123.00324509041576, 37.69792596395471],
      zoom: 11.5,
      pitch: 50,
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
        exaggeration: 0.5,
      })

      let lastTime = 0.0
      let animationTime = 0.0
      const initialBearing = map.getBearing()
      const ROTATION_SPEED = 1.25

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
      animation: 'swimBite',
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

  const { enablePan, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, minDistance, maxDistance } =
    useControls('farallon-orbit', {
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
  const { rotationX, rotationY, rotationZ, scaleShark, positionX, positionY, positionZ } = useControls(
    'farallon-shark',
    {
      positionX: { value: 0.0, min: -5, max: 5, step: 0.01 },
      positionY: { value: 0.78, min: -5, max: 5, step: 0.01 },
      positionZ: { value: 0, min: -5, max: 5, step: 0.01 },
      scale: { value: 0.8, min: -0.5, max: 1, step: 0.01 },
      rotationX: { value: 0, min: -2, max: 5, step: 0.01 },
      rotationY: { value: 0, min: -5, max: 5, step: 0.01 },
      rotationZ: { value: 0, min: -3, max: 4, step: 0.01 },
    },
  )

  const {
    bubblePositionX,
    bubblePositionY,
    bubblePositionZ,
    bubbleScale,
    distort,
    transmission,
    thickness,
    roughness,
    iridescence,
    iridescenceIOR,
    iridescenceThicknessRangeX,
    iridescenceThicknessRangeY,
    clearcoat,
    clearcoatRoughness,
    envMapIntensity,
  } = useControls('bubble', {
    bubblePositionX: { value: 0.42, min: -10, max: 10, step: 0.01 },
    bubblePositionY: { value: -0.7, min: -10, max: 10, step: 0.01 },
    bubblePositionZ: { value: 2.58, min: -10, max: 10, step: 0.01 },
    bubbleScale: { value: 0.5, min: 0, max: 2, step: 0.02 },
    distort: { value: 0.3, min: 0, max: 1, step: 0.01 },
    transmission: { value: 1.05, min: 0, max: 5, step: 0.01 },
    roughness: { value: 0, min: -2, max: 5, step: 0.01 },
    iridescence: { value: 0.86, min: 0, max: 5, step: 0.01 },
    iridescenceIOR: { value: 1, min: -2, max: 5, step: 0.01 },
    iridescenceThicknessRangeX: { value: 0, min: -2, max: 5000, step: 0.01 },
    iridescenceThicknessRangeY: { value: 1200, min: -2, max: 5000, step: 0.01 },
    clearcoat: { value: 0.5, min: -2, max: 5, step: 0.01 },
    clearcoatRoughness: { value: 0, min: -2, max: 5, step: 0.01 },
    envMapIntensity: { value: 1, min: -2, max: 5, step: 0.01 },
  })

  const userAdventureMode = useStore((state) => state.adventureMode)
  const markDestinationVisted = useStore((state) => state.markDestinationVisited)

  useEffect(() => {
    markDestinationVisted('farallon')
  }, [markDestinationVisted])

  const { audioEnabled } = useStore()

  return (
    <>
      <div ref={mapContainerRef} className='absolute left-0 top-0 z-0 size-full'></div>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        {/* <ambientLight intensity={0.5} /> */}
        {/* <directionalLight position={[5, 10, 5]} intensity={0.5} /> */}
        <OrbitControls
          enablePan={enablePan}
          minPolarAngle={minPolarAngle}
          maxPolarAngle={maxPolarAngle}
          minAzimuthAngle={minAzimuthAngle}
          maxAzimuthAngle={maxAzimuthAngle}
          minDistance={minDistance}
          maxDistance={maxDistance}
        />
        <Suspense>
          <Shark
            ref={sharkRef}
            currentAnimation={currentDialog.animation}
            scale={0.8}
            position={[positionX, positionY, positionZ]}
            rotation={[rotationX, rotationY, rotationZ]}
          />
          <BubbleSystem sharkRef={sharkRef} audioEnabled={audioEnabled} />
        </Suspense>
        <Common />
      </View>
      <BackButton userAdventureMode={userAdventureMode} />
      <SpeechBubble text={currentDialog.text} onNext={handleNextDialog} hasEnded={hasEnded} />
      {audioEnabled && <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />}
    </>
  )
}
