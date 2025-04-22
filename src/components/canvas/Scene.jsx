'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'
import { Physics } from '@react-three/rapier'

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas
      {...props}
      // onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}
      onCreated={(state) => (state.gl.toneMapping = THREE.ACESFilmicToneMapping)}
      // onCreated={(state) => (state.gl.toneMapping = THREE.ReinhardToneMapping)}
      // onCreated={(state) => (state.gl.toneMapping = THREE.CineonToneMapping)}
    >
      {/* @ts-ignore */}
      <Physics>
        <r3f.Out />
        <Preload all />
      </Physics>
    </Canvas>
  )
}
