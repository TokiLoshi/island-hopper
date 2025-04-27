import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import * as THREE from 'three'

const BUBBLE_COUNT = 10
const MOVEMENT_SPEED = 0.1
const BUBBLE_SCALE_MIN = 0.1
const BUBBLE_SCALE_MAX = 0.4
const SPAWN_Y_POSITION = -3
const DISPOSAL_Y_POSITION = 5

const generateBubbles = () =>
  Array.from({ length: BUBBLE_COUNT }, () => ({
    id: Math.random().toString(),
    factor: THREE.MathUtils.randInt(5, 10),
    speed: THREE.MathUtils.randFloat(0.01, 0.15),
    xFactor: THREE.MathUtils.randFloatSpread(6),
    yFactor: SPAWN_Y_POSITION,
    zFactor: THREE.MathUtils.randFloatSpread(3),
    scale: THREE.MathUtils.randFloat(BUBBLE_SCALE_MIN, BUBBLE_SCALE_MAX),
    isPopping: false,
  }))

// Thanks for the inspiration Pmndrs https://codesandbox.io/p/sandbox/i6t0j
export function BubbleSystem() {
  const [bubbles, setBubbles] = useState(generateBubbles)
  const instancesRef = useRef()

  const handleBubblePop = (id) => {
    setBubbles((currentBubbles) => currentBubbles.filter((bubble) => bubble.id !== id))
  }
  useEffect(() => {
    if (bubbles.length === 0) {
      setBubbles(generateBubbles())
      // const newBubbles = [
      //   {
      //     id: Math.random().toString(),
      //     factor: THREE.MathUtils.randInt(5, 10),
      //     speed: THREE.MathUtils.randFloat(0.01, 0.15),
      //     xFactor: THREE.MathUtils.randFloatSpread(6),
      //     yFactor: SPAWN_Y_POSITION,
      //     zFactor: THREE.MathUtils.randFloatSpread(3),
      //     scale: THREE.MathUtils.randFloat(BUBBLE_SCALE_MIN, BUBBLE_SCALE_MAX),
      //     isPopping: false,
      //     initialX: Math.sin(5) * 0.2 + THREE.MathUtils.randFloatSpread(6) + Math.cos(5 * 0.5) * 0.5,
      //     initialY: SPAWN_Y_POSITION,
      //     initialZ: Math.cos(5) * 0.2 + THREE.MathUtils.randFloatSpread(6) + Math.sin(5 * 0.5) * 0.3,
      //   },
      // ]
      // setBubbles((current) => [...current, ...newBubbles])
    }
  }, [bubbles.length])

  return (
    <Instances limit={BUBBLE_COUNT} ref={instancesRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        roughness={0.1}
        transmission={0.95}
        transparent={true}
        opacity={0.7}
        ior={1.1}
        color='#a5bfe8'
      />
      {bubbles.map((data) => (
        <Bubble key={data.id} {...data} onPop={() => handleBubblePop(data.id)} />
      ))}
    </Instances>
  )
}

function Bubble({ id, factor, speed, xFactor, yFactor, zFactor, scale, onPop }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = factor + state.clock.elapsedTime * speed
    ref.current.scale.setScalar(scale)
    ref.current.position.set(
      Math.sin(t) * 0.2 + xFactor + Math.cos(t * 0.5) * 0.5,
      yFactor + state.clock.elapsedTime * (MOVEMENT_SPEED * (0.8 + factor / 10)) + Math.sin(t * 0.5) * 0.5,
      Math.cos(t) * 0.2 + zFactor + Math.sin(t * 0.5) * 0.3,
    )

    if (ref.current.position.y > DISPOSAL_Y_POSITION) {
      onPop()
    }
  })
  const handleClick = (event) => {
    event.stopPropagation()
    onPop()
  }
  return <Instance ref={ref} onClick={handleClick} />
}
