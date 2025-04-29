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
import { useControls } from 'leva'
import useStore from '@/store/globalStore'
import Shader from '@/templates/Shader/OceanShader/OceanShader'
import { animated, easings, useSpring } from '@react-spring/three'
import BackgroundAudio from '@/components/dom/BackgroundAudio'

const Dolphin2 = dynamic(() => import('@/components/canvas/Dolphin2').then((mod) => mod.Dolphin2), { ssr: false })

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
      zoom: 13,
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
    })

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
    // {
    //   text: `You might have seen Tuvalu's foreign minister knee-deep in the ocean, presenting for COP26, calling for climate action.`,
    //   animation: 'sittingEnd',
    //   audioSrc: `${rootDirectory}5${fileType}`,
    // },
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

  const { enablePan, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, minDistance, maxDistance } =
    useControls('orbit', {
      enablePan: true,
      // Polar angle
      minPolarAngle: { value: 1.13, min: 0, max: Math.PI / 2, step: 0.01 },
      maxPolarAngle: { value: Math.PI / 2 - 0.1, min: 0, max: 2, step: 0.01 },
      // Azimuth
      minAzimuthAngle: { value: -0.8, min: -1, max: Math.PI / 4, step: 0.05 },
      maxAzimuthAngle: { value: 0.54, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
      minDistance: { value: 3, min: 1, max: 10, step: 0.01 },
      maxDistance: { value: 5, min: 1, max: 50, step: 0.01 },
    })

  const { boatRotationX, boatRotationY, boatRotationZ, boatScale, boatPositionX, boatPositionY, boatPositionZ } =
    useControls('boat', {
      boatRotationX: { value: 0, min: -5, max: 5, step: 0.01 },
      boatRotationY: { value: -0.5, min: -5, max: 5, step: 0.01 },
      boatRotationZ: { value: 0, min: -5, max: 5, step: 0.01 },
      boatScale: { value: 0.002, min: -0.0005, max: 1, step: 0.01 },
      boatPositionX: { value: 0.21, min: -2, max: 5, step: 0.01 },
      boatPositionY: { value: -0.1, min: -5, max: 5, step: 0.01 },
      boatPositionZ: { value: 0, min: -3, max: 4, step: 0.01 },
    })

  const { bunnyRotationX, bunnyRotationY, bunnyRotationZ, bunnyScale, bunnyPositionX, bunnyPositionY, bunnyPositionZ } =
    useControls('bunny', {
      bunnyRotationX: { value: 0, min: -5, max: 10, step: 0.01 },
      bunnyRotationY: { value: 0, min: -5, max: 10, step: 0.01 },
      bunnyRotationZ: { value: 0, min: -5, max: 10, step: 0.01 },
      bunnyScale: { value: 0.12, min: 0.05, max: 1, step: 0.01 },
      bunnyPositionX: { value: 0.6, min: -5, max: 10, step: 0.01 },
      bunnyPositionY: { value: 0.17, min: -5, max: 10, step: 0.01 },
      bunnyPositionZ: { value: 0.3, min: -5, max: 10, step: 0.01 },
    })

  const { y } = useSpring({
    from: {
      y: -5,
    },
    to: [
      {
        y: -4,
      },
      {
        y: -3,
      },
      {
        y: -2,
      },
      { y: -1 },
      {
        y: 0,
      },
    ],
    config: {
      mass: 1,
      tension: 180,
      friction: 26,
    },
    loop: false,
    pause: !hasEnded,
  })

  // const { rock } = useSpring({
  //   from: { rock: 0.5 },
  //   to: [{ rock: 0.05 }],
  //   config: {
  //     duration: 3500,
  //     easing: easings.easeInOutSine,
  //   },
  //   loop: { reverse: true },
  // })

  const {
    secondDolphinPositionX,
    secondDolphinPositionY,
    secondDolphinPositionZ,
    secondDolphinRotationX,
    secondDolphinRotationY,
    secondDolphinRotationZ,
    secondDolphinScale,
  } = useControls('secondDolphin', {
    secondDolphinPositionX: { value: 0, min: -20, max: 20, step: 0.01 },
    secondDolphinPositionY: { value: -0.8, min: -20, max: 20, step: 0.01 },
    secondDolphinPositionZ: { value: 0.8, min: -20, max: 20, step: 0.01 },
    secondDolphinRotationX: { value: -4.7, min: -20, max: 20, step: 0.01 },
    secondDolphinRotationY: { value: -1.4, min: -20, max: 20, step: 0.01 },
    secondDolphinRotationZ: { value: 1.8, min: -20, max: 20, step: 0.01 },
    secondDolphinScale: { value: 0.25, min: 0.01, max: 1, step: 0.01 },
  })

  const userAdventureMode = useStore((state) => state.adventureMode)
  const markDestinationVisted = useStore((state) => state.markDestinationVisited)

  useEffect(() => {
    markDestinationVisted('tuvalu')
  }, [markDestinationVisted])

  const { audioEnabled } = useStore()

  const wavesSoundPath = '/soundEffects/wavesEdited.mp3'

  return (
    <>
      <div ref={mapContainerRef} className='absolute left-0 top-0 z-0 size-full'></div>
      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <OrbitControls
          enablePan={enablePan}
          minPolarAngle={minPolarAngle}
          maxPolarAngle={maxPolarAngle}
          minAzimuthAngle={minAzimuthAngle}
          maxAzimuthAngle={maxAzimuthAngle}
          minDistance={minDistance}
          maxDistance={maxDistance}
        />
        {/* {hasEnded && audioEnabled && <BackgroundAudio audioFilePath={wavesSoundPath} />} */}
        {hasEnded && (
          <animated.mesh position-x={0} position-y={y} position-z={0} rotation={[-Math.PI / 2, 0, 0]} scale={[5, 5, 1]}>
            <planeGeometry args={[5, 5, 32, 31]} />
            <Shader transparent={true} />
          </animated.mesh>
        )}
        {/* <animated.group rotation-z={rock}> */}
        <Boat
          position={[boatPositionX, boatPositionY, boatPositionZ]}
          scale={boatScale}
          // rotation-x={boatRotationX}
          // rotation-y={boatRotationY}
          rotation={[boatRotationX, boatRotationY, boatRotationZ]}
        />
        {/* </animated.group> */}
        <Bunny
          position={[bunnyPositionX, bunnyPositionY, bunnyPositionZ]}
          scale={bunnyScale}
          rotation={[bunnyRotationX, bunnyRotationY, bunnyRotationZ]}
          currentAnimation={currentDialog.animation}
        />

        <directionalLight position={[5, 5, 3.5]} intensity={1.5} castShadow />
        <Common />
        {currentIndex === dialogSteps.length - 1 && (
          <animated.group position-y={y}>
            <Dolphin2
              position-x={secondDolphinPositionX}
              position-y={secondDolphinPositionY}
              position-z={secondDolphinPositionZ}
              // position={[secondDolphinPositionX, secondDolphinPositionY, secondDolphinPositionZ]}
              rotation-x={secondDolphinRotationX}
              rotation-y={secondDolphinRotationY}
              rotation-z={secondDolphinRotationZ}
              scale={secondDolphinScale}
            />
          </animated.group>
        )}
      </View>
      <BackButton userAdventureMode={userAdventureMode} />
      <SpeechBubble text={currentDialog.text} hasEnded={hasEnded} onNext={handleNextDialog} />
      {audioEnabled && <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />}
    </>
  )
}
