// @ts-nocheck
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import vertex from './glsl/shader.vert'
import fragment from './glsl/shader.frag'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const ShaderImpl = shaderMaterial(
  {
    time: 0,
    waveHeight: 0.5,
    color: new THREE.Color(0.0, 0.3, 0.5),
    uTime: 0,
    uBigWavesElevation: 0.2,
    uBigWavesFrequency: new THREE.Vector2(4, 1.5),
    uBigWavesSpeed: 0.75,
    uSmallWavesElevation: 0.25,
    uSmallWavesFrequency: 3.5,
    uSmallWavesSpeed: 0.2,
    uSmallWavesIterations: 4.0,
    uDepthColor: new THREE.Color('#015871'),
    uSurfaceColor: new THREE.Color('#00bfff'),
  },
  vertex,
  fragment,
)

extend({ ShaderImpl })

// eslint-disable-next-line react/display-name
const Shader = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef()

  useImperativeHandle(ref, () => localRef.current)

  useFrame((_, delta) => (localRef.current.time += delta))
  return <shaderImpl ref={localRef} glsl={THREE.GLSL3} {...props} attach='material' />
})

export default Shader
