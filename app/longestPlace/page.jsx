'use client'

import { OrbitControls, PresentationControls, Text } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import SpeechBubble from '@/components/dom/SpeechBubble'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import BackButton from '@/components/dom/BackButton'
import AudioPlayer from '@/components/dom/AudioPlayer'
import { useControls } from 'leva'
import useStore from '@/store/globalStore'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { DirectionalLight } from 'three'

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
      zoom: 12,
      pitch: 55,
      antialias: true,
      globe: true,
    })

    mapRef.current = map

    mapRef.current.on('style.load', () => {
      const map = mapRef.current

      map.setConfigProperty('basemap', 'lightPreset', 'dawn')

      // use an expression to transition some properties between zoom levels 11 and 13, preventing visibility when zoomed out
      const zoomBasedReveal = (value) => {
        return ['interpolate', ['linear'], ['zoom'], 10, 0.0, 14, value]
      }

      map.setSnow({
        density: zoomBasedReveal(0.85),
        intensity: 1.0,
        'center-thinning': 0.1,
        direction: [0, 50],
        opacity: 1.0,
        color: '#ffffff',
        'flake-size': 0.71,
        vignette: zoomBasedReveal(0.3),
        'vignette-color': '#ffffff',
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
      const ROTATION_SPEED = 1.0

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

  const rootDirectory = './voiceover/split/NardinaLongestPlace/NardinaLongestPlace'
  const fileType = '.mp3'

  const dialogSteps = [
    { text: `Welcome to the Longest Named Place!`, animation: 'wave', audioSrc: `${rootDirectory}1${fileType}` },
    {
      text: `Locals call this Taumata Hill; I think the full name is much more fun!`,
      animation: 'jump',
      audioSrc: `${rootDirectory}2${fileType}`,
    },
    {
      text: `Want to hear how it is pronounced? Click on the boom box`,
      animation: 'yes',
      audioSrc: `${rootDirectory}3${fileType}`,
    },
    {
      text: `With a total of 85 characters, it is indeed quite a mouthful to say`,
      animation: 'walk',
      audioSrc: `${rootDirectory}4${fileType}`,
    },
    {
      text: `The name translates into "the place where Tamatea, the man with the big knees, who slid, climbed and swallowed mountains, known as land eater, played his flute to his loved one"`,
      animation: 'duck',
      audioSrc: `${rootDirectory}5${fileType}`,
    },
    {
      text: `Tamatea was a legendary chief and warrior. That is all I have for you on the longest place name in the world! Click on the world button to return to the map and keep exploring.`,
      animation: 'punch',
      audioSrc: `${rootDirectory}6${fileType}`,
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
      minPolarAngle: { value: 1.57, min: 0, max: Math.PI / 2, step: 0.01 },
      maxPolarAngle: { value: 1.47, min: 0, max: 2, step: 0.01 },
      // Azimuth
      minAzimuthAngle: { value: 0.0, min: 0, max: Math.PI / 4, step: 0.05 },
      maxAzimuthAngle: { value: 0.19, min: -Math.PI / 2, max: Math.PI / 2, step: 0.05 },
      minDistance: { value: 7, min: 1, max: 10, step: 0.01 },
      maxDistance: { value: 9, min: 1, max: 50, step: 0.01 },
    })
  const { signRotationX, signRotationY, signRotationZ, signScale, signPositionX, signPositionY, signPositionZ } =
    useControls('sign', {
      signRotationX: { value: 0.2, min: -5, max: 5, step: 0.01 },
      signRotationY: { value: 0.08, min: -5, max: 5, step: 0.01 },
      signRotation: { value: 0.1, min: -5, max: 5, step: 0.01 },
      signScale: { value: 1, min: -0.5, max: 1, step: 0.01 },
      signPositionX: { value: 0, min: -2, max: 5, step: 0.01 },
      signPositionY: { value: -0.5, min: -5, max: 5, step: 0.01 },
      signPositionZ: { value: -0.01, min: -3, max: 4, step: 0.01 },
    })

  const {
    boomboxRotationX,
    boomboxRotationY,
    boomboxRotationZ,
    boomboxScale,
    boomboxPositionX,
    boomboxPositionY,
    boomboxPositionZ,
  } = useControls('boombox', {
    boomboxRotationX: { value: 0, min: -5, max: 10, step: 0.01 },
    boomboxRotationY: { value: -0.3, min: -5, max: 10, step: 0.01 },
    boomboxRotationZ: { value: 0, min: -5, max: 10, step: 0.01 },
    boomboxScale: { value: 0.35, min: -5, max: 2, step: 0.01 },
    boomboxPositionX: { value: 1, min: -5, max: 10, step: 0.01 },
    boomboxPositionY: { value: -0.8, min: -5, max: 10, step: 0.01 },
    boomboxPositionZ: { value: 0.5, min: -5, max: 10, step: 0.01 },
  })

  const { bunnyPositionX, bunnyPositionY, bunnyPositionZ, bunnyScale, bunnyRotationX, bunnyRotationY, bunnyRotationZ } =
    useControls('Bunny', {
      bunnyPositionX: { value: -1.1, min: -5, max: 10, step: 0.01 },
      bunnyPositionY: { value: -1, min: -5, max: 10, step: 0.01 },
      bunnyPositionZ: { value: 2, min: -5, max: 10, step: 0.01 },
      bunnyScale: { value: 0.4, min: 0.1, max: 2, step: 0.1 },
      bunnyRotationX: { value: 0, min: -5, max: 10, step: 0.1 },
      bunnyRotationY: { value: 0.4, min: -5, max: 10, step: 0.01 },
      bunnyRotationZ: { value: 0, min: -5, max: 10, step: 0.01 },
    })

  const { firstTextPositionX, firstTextPositionY, firstTextPositionZ, firstFontSize } = useControls('firstText', {
    firstTextPositionX: { value: 0, min: -5, max: 10, step: 0.01 },
    firstTextPositionY: { value: 1.4, min: -5, max: 10, step: 0.01 },
    firstTextPositionZ: { value: 0.02, min: -5, max: 10, step: 0.01 },
    firstFontSize: { value: 0.15, min: 0.1, max: 5, step: 0.01 },
  })

  const { secondTextPositionX, secondTextPositionY, secondTextPositionZ } = useControls('secondText', {
    secondTextPositionX: { value: 0, min: -5, max: 10, step: 0.01 },
    secondTextPositionY: { value: 1.11, min: -5, max: 10, step: 0.01 },
    secondTextPositionZ: { value: 0.02, min: -5, max: 10, step: 0.01 },
  })

  const { thirdTextPositionX, thirdTextPositionY, thirdTextPositionZ } = useControls('third text', {
    thirdTextPositionX: { value: 0, min: -5, max: 10, step: 0.01 },
    thirdTextPositionY: { value: 0.83, min: -5, max: 10, step: 0.01 },
    thirdTextPositionZ: { value: 0.02, min: -5, max: 10, step: 0.01 },
  })

  const userAdventureMode = useStore((state) => state.adventureMode)
  const markDestinationVisted = useStore((state) => state.markDestinationVisited)

  useEffect(() => {
    markDestinationVisted('longestPlace')
  }, [markDestinationVisted])

  return (
    <>
      <div ref={mapContainerRef} className='absolute left-0 top-0 z-0 size-full'></div>
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
          <group>
            <Text
              color='whitesmoke'
              anchorX='center'
              anchorY='middle'
              fontSize={firstFontSize}
              position={[firstTextPositionX, firstTextPositionY, firstTextPositionZ]}
            >
              {cleanedFirst}
            </Text>
            <Text
              color='whitesmoke'
              anchorX='center'
              anchorY='middle'
              fontSize={firstFontSize}
              position={[secondTextPositionX, secondTextPositionY, secondTextPositionZ]}
            >
              {cleanedSecond}
            </Text>
            <Text
              color='whitesmoke'
              anchorX='center'
              anchorY='middle'
              fontSize={firstFontSize}
              position={[thirdTextPositionX, thirdTextPositionY, thirdTextPositionZ]}
            >
              {cleanedThird}
            </Text>
          </group>

          <Sign position={[signPositionX, signPositionY, signPositionZ]} scale={signScale} />

          <Boombox
            scale={boomboxScale}
            position={[boomboxPositionX, boomboxPositionY, boomboxPositionZ]}
            rotation={[boomboxRotationX, boomboxRotationY, boomboxRotationZ]}
            onPointerEnter={() => (document.body.style.cursor = 'pointer')}
            onPointerLeave={() => (document.body.style.cursor = 'default')}
          />

          <Bunny
            position={[bunnyPositionX, bunnyPositionY, bunnyPositionZ]}
            scale={bunnyScale}
            rotation={[bunnyRotationX, bunnyRotationY, bunnyRotationZ]}
            currentAnimation={currentDialog.animation}
          />
          <EffectComposer>
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
          </EffectComposer>
          <Common />
        </Suspense>
      </View>
      <BackButton userAdventureMode={userAdventureMode} />
      <SpeechBubble text={currentDialog.text} onNext={handleNextDialogue} hasEnded={hasEnded} />
      {/* <audio ref={audioRef} preload='auto' /> */}
      <AudioPlayer audioFilePath={currentDialog.audioSrc} autoPlay={true} initialDelay={500} />
    </>
  )
}
