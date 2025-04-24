'use client'

import { OrbitControls, Plane } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import BackButton from '@/components/dom/BackButton'
import SpeechBubble from '@/components/dom/SpeechBubble'
import AudioPlayer from '@/components/dom/AudioPlayer'
import { useControls } from 'leva'
import useStore from '@/store/globalStore'
import { RigidBody, Physics, CuboidCollider } from '@react-three/rapier'

import { useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

function Volcano(props) {
  const { nodes, materials } = useGLTF('/models/Volcano.glb')
  return (
    <Suspense fallback='null'>
      <group {...props} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes.volcano.geometry} material={materials.None} />
      </group>
    </Suspense>
  )
}

useGLTF.preload('/models/Volcano.glb')

// const Volcano = dynamic(() => import('@/components/canvas/Volcano').then((mod) => mod.Volcano), { ssr: false })
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

export default function Kilauea() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !mapboxgl.accessToken) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-155.286, 19.41],
      zoom: 12,
      pitch: 55,
      antialias: true,
    })
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right')
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
      const ROTATION_SPEED = 0.75

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

  const rootDirectory = './voiceover/split/NardinaKilauea/NardinaKilauea'
  const fileType = '.mp3'
  const dialogSteps = [
    {
      text: `Welcome to Kilauea on the Island of Hawai'i!`,
      animation: 'wave',
      audioSrc: `${rootDirectory}1${fileType}`,
    },
    {
      text: `Kilauea is one of the youngest and most active Volcanos on Earth!`,
      animation: 'yes',
      audioSrc: `${rootDirectory}2${fileType}`,
    },
    {
      text: `But it's only young in geological terms; this shield volcano is between 210 and 280 thousand years old! It has only been above sea level for about 100 thousand years!`,
      animation: 'no',
      audioSrc: `${rootDirectory}3${fileType}`,
    },
    {
      text: `Oh wow! It looks like it's actively erupting right now! While this is a vulcanologist's dream, we might not want to stick around for long! Meet me back at the map when you are ready.
`,
      animation: 'death',
      audioSrc: `${rootDirectory}4${fileType}`,
    },
  ]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasEnded, setHasEnded] = useState(false)
  const currentDialog = dialogSteps[currentIndex]
  const handleNextDialog = () => {
    // eslint-disable-next-line no-console
    console.log(`Index: ${currentIndex} and hasEnded: ${hasEnded} dialog ${dialogSteps[currentIndex].text}`)
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
      minPolarAngle: { value: 0.86, min: 0, max: Math.PI / 2, step: 0.01 },
      maxPolarAngle: { value: 1.47, min: 0, max: 2, step: 0.01 },
      // Azimuth
      minAzimuthAngle: { value: 0.0, min: 0, max: Math.PI / 4, step: 0.05 },
      maxAzimuthAngle: { value: 0.19, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
      minDistance: { value: 3, min: 1, max: 10, step: 0.01 },
      maxDistance: { value: 5, min: 1, max: 50, step: 0.01 },
    })
  const { rotationX, rotationY, rotationZ, scaleVolcano, positionX, positionY, positionZ } = useControls('volcano', {
    positionX: { value: 0.62, min: -5, max: 5, step: 0.01 },
    positionY: { value: 0.28, min: -5, max: 5, step: 0.01 },
    positionZ: { value: 0.8, min: -5, max: 5, step: 0.01 },
    scale: { value: 0.6, min: -0.5, max: 1, step: 0.01 },
    rotationX: { value: 0, min: -2, max: 5, step: 0.01 },
    rotationY: { value: 0.62, min: -5, max: 5, step: 0.01 },
    rotationZ: { value: 0, min: -3, max: 4, step: 0.01 },
  })

  const { floorPositionX, floorPositionY, floorPositionZ, floorRotationX, floorRotationY, floorRotationZ } =
    useControls('floor', {
      floorPositionX: { value: 0.53, min: -5, max: 5, step: 0.01 },
      floorPositionY: { value: -0.1, min: -5, max: 5, step: 0.01 },
      floorPositionZ: { value: 0.66, min: -5, max: 5, step: 0.01 },
      floorRotationX: { value: 0, min: -5, max: 5, step: 0.01 },
      floorRotationY: { value: -Math.PI, min: -5, max: 5, step: 0.01 },
      floorRotationZ: { value: 0, min: -5, max: 5, step: 0.01 },
    })

  const userAdventureMode = useStore((state) => state.adventureMode)
  const markDestinationVisted = useStore((state) => state.markDestinationVisited)

  useEffect(() => {
    markDestinationVisted('kilauea')
  }, [markDestinationVisted])

  const { audioEnabled } = useStore()

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
        <Physics debug gravity={[0, -9.81, 0]}>
          <RigidBody colliders='ball' position={[0.5, 2, 1]} restitution={0.7} mass={1}>
            <mesh>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color='orange' />
            </mesh>
          </RigidBody>

          <RigidBody type='fixed' colliders='trimesh'>
            <Volcano
              position={[positionX, positionY, positionZ]}
              rotation={[rotationX, rotationY, rotationZ]}
              scale={scaleVolcano}
            />
          </RigidBody>

          <RigidBody type='fixed'>
            <CuboidCollider
              args={[0.1, 0.5, 1.1]}
              rotation={[-Math.PI, 0, 0]}
              position={[floorPositionX - 1.2, floorPositionY, floorPositionZ]}
            />
            <CuboidCollider
              args={[0.1, 0.5, 1.1]}
              rotation={[Math.PI, 0, 0]}
              position={[floorPositionX + 1.2, floorPositionY, floorPositionZ]}
            />
            <CuboidCollider args={[1.1, 0.5, 0.1]} position={[floorPositionX, floorPositionY, floorPositionZ + 1.2]} />
            <CuboidCollider args={[1.1, 0.5, 0.1]} position={[floorPositionX, floorPositionY, floorPositionZ - 1.2]} />
            <mesh
              position={[floorPositionX, floorPositionY, floorPositionZ]}
              rotation={[floorRotationX, floorRotationY, floorRotationZ]}
            >
              <boxGeometry args={[2.2, 0.1, 2.2]} />
              <meshStandardMaterial color='mediumpurple' />
            </mesh>
          </RigidBody>
        </Physics>
        <Bunny
          position={[-1.4, -1, -0.8]}
          scale={0.4}
          rotation={[0, 0.5, 0]}
          currentAnimation={currentDialog.animation}
        />
        <Common />
      </View>
      <BackButton userAdventureMode={userAdventureMode} />
      <SpeechBubble text={currentDialog.text} hasEnded={hasEnded} onNext={handleNextDialog} />
      {audioEnabled && <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />}
    </>
  )
}
