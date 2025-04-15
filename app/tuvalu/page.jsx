'use client'

import { OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef } from 'react'

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

export default function Tuvalu() {
  return (
    // <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
    <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
      <OrbitControls />
      <ambientLight intensity={1.5} />
      <Boat position={[0, -0.2, 0]} scale={0.002} rotation={[0, -0.5, 0]} />
      <Bunny position={[0.18, 0, 0.25]} scale={0.12} rotation={[0.2, 0, 0]} />
      <directionalLight position={[5, 5, 3.5]} intensity={1.5} castShadow />
      <Common />
    </View>
  )
}
