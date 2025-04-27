// import React, { useState, useRef, useEffect } from 'react'
// import { useFrame } from '@react-three/fiber'
// import { Instances, Instance } from '@react-three/drei'
// import * as THREE from 'three'

// const BUBBLE_COUNT = 10
// const MOVEMENT_SPEED = 0.1
// const BUBBLE_SCALE_MIN = 0.1
// const BUBBLE_SCALE_MAX = 0.4
// const SPAWN_Y_POSITION = -3
// const DISPOSAL_Y_POSITION = 5

// const generateBubbles = () =>
//   Array.from({ length: BUBBLE_COUNT }, () => ({
//     id: Math.random().toString(),
//     factor: THREE.MathUtils.randInt(5, 10),
//     speed: THREE.MathUtils.randFloat(0.01, 0.15),
//     xFactor: THREE.MathUtils.randFloatSpread(6),
//     yFactor: SPAWN_Y_POSITION,
//     zFactor: THREE.MathUtils.randFloatSpread(3),
//     scale: THREE.MathUtils.randFloat(BUBBLE_SCALE_MIN, BUBBLE_SCALE_MAX),
//     isPopping: false,
//   }))

// // Thanks for the inspiration Pmndrs https://codesandbox.io/p/sandbox/i6t0j
// export function BubbleSystem() {
//   const [bubbles, setBubbles] = useState(generateBubbles)
//   const instancesRef = useRef()

//   const handleBubblePop = (id) => {
//     setBubbles((currentBubbles) => currentBubbles.filter((bubble) => bubble.id !== id))
//   }
//   useEffect(() => {
//     if (bubbles.length === 0) {
//       setBubbles(generateBubbles())
//       // const newBubbles = [
//       //   {
//       //     id: Math.random().toString(),
//       //     factor: THREE.MathUtils.randInt(5, 10),
//       //     speed: THREE.MathUtils.randFloat(0.01, 0.15),
//       //     xFactor: THREE.MathUtils.randFloatSpread(6),
//       //     yFactor: SPAWN_Y_POSITION,
//       //     zFactor: THREE.MathUtils.randFloatSpread(3),
//       //     scale: THREE.MathUtils.randFloat(BUBBLE_SCALE_MIN, BUBBLE_SCALE_MAX),
//       //     isPopping: false,
//       //     initialX: Math.sin(5) * 0.2 + THREE.MathUtils.randFloatSpread(6) + Math.cos(5 * 0.5) * 0.5,
//       //     initialY: SPAWN_Y_POSITION,
//       //     initialZ: Math.cos(5) * 0.2 + THREE.MathUtils.randFloatSpread(6) + Math.sin(5 * 0.5) * 0.3,
//       //   },
//       // ]
//       // setBubbles((current) => [...current, ...newBubbles])
//     }
//   }, [bubbles.length])

//   return (
//     <Instances limit={BUBBLE_COUNT} ref={instancesRef}>
//       <sphereGeometry args={[1, 16, 16]} />
//       <meshPhysicalMaterial
//         roughness={0.1}
//         transmission={0.95}
//         transparent={true}
//         opacity={0.7}
//         ior={1.1}
//         color='#a5bfe8'
//       />
//       {bubbles.map((data) => (
//         <Bubble key={data.id} {...data} onPop={() => handleBubblePop(data.id)} />
//       ))}
//     </Instances>
//   )
// }

// function Bubble({ id, factor, speed, xFactor, yFactor, zFactor, scale, onPop }) {
//   const ref = useRef()

//   useFrame((state) => {
//     if (!ref.current) return
//     const t = factor + state.clock.elapsedTime * speed
//     ref.current.scale.setScalar(scale)
//     ref.current.position.set(
//       Math.sin(t) * 0.2 + xFactor + Math.cos(t * 0.5) * 0.5,
//       yFactor + state.clock.elapsedTime * (MOVEMENT_SPEED * (0.8 + factor / 10)) + Math.sin(t * 0.5) * 0.5,
//       Math.cos(t) * 0.2 + zFactor + Math.sin(t * 0.5) * 0.3,
//     )

//     if (ref.current.position.y > DISPOSAL_Y_POSITION) {
//       onPop()
//     }
//   })
//   const handleClick = (event) => {
//     event.stopPropagation()
//     onPop()
//   }
//   return <Instance ref={ref} onClick={handleClick} />
// }

import React, { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'

// Constants
const BUBBLE_COUNT = 10
const SPAWN_Y = -3
const DESPAWN_Y = 5
const MIN_SCALE = 0.1
const MAX_SCALE = 0.4
const SPEED_BASE = 0.1

// Generate initial bubble data
function makeBubbles() {
  return Array.from({ length: BUBBLE_COUNT }, () => ({
    factor: THREE.MathUtils.randInt(5, 10),
    speed: THREE.MathUtils.randFloat(0.01, 0.15),
    x: THREE.MathUtils.randFloatSpread(6),
    y: SPAWN_Y,
    z: THREE.MathUtils.randFloatSpread(3),
    scale: THREE.MathUtils.randFloat(MIN_SCALE, MAX_SCALE),
    popped: false,
    popTimer: 0,
  }))
}

// Sparkle prototype
class Sparkle {
  constructor(pos) {
    this.position = pos.clone()
    this.velocity = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
    this.life = THREE.MathUtils.randFloat(0.3, 0.6)
  }
}

export function BubbleSystem() {
  // 1. Fixed bubble data in a ref
  const bubbles = useRef(makeBubbles()).current

  // 2. One InstancedMesh ref + dummy object
  const instRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 3. Sparkles in a ref array
  const sparkles = useRef([])

  // 4. We'll rebuild the points geometry each frame
  const [pointsGeo] = useState(() => new THREE.BufferGeometry())
  const positionsArray = useMemo(
    () => new Float32Array(1000 * 3), // max 1000 sparkles
    [],
  )
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))

  // Animation loop
  useFrame((state, dt) => {
    // Update bubbles
    bubbles.forEach((b, i) => {
      const t = b.factor + state.clock.elapsedTime * b.speed

      if (b.popped) {
        // shrink down
        b.popTimer += dt
        b.scale = THREE.MathUtils.lerp(b.scale, 0, dt * 6)
        if (b.popTimer > 0.25) {
          // respawn
          b.popped = false
          b.popTimer = 0
          b.y = SPAWN_Y
          b.x = THREE.MathUtils.randFloatSpread(6)
          b.z = THREE.MathUtils.randFloatSpread(3)
          b.scale = THREE.MathUtils.randFloat(MIN_SCALE, MAX_SCALE)
        }
      } else {
        // float up
        b.y += dt * SPEED_BASE * (1 + b.factor / 10)
        // wrap around
        if (b.y > DESPAWN_Y) {
          b.y = SPAWN_Y
          b.x = THREE.MathUtils.randFloatSpread(6)
          b.z = THREE.MathUtils.randFloatSpread(3)
        }
      }

      // position + scale on the dummy
      dummy.position.set(Math.sin(t) * 0.2 + b.x, b.y + Math.sin(t * 0.5) * 0.3, Math.cos(t) * 0.2 + b.z)
      dummy.scale.setScalar(b.scale)
      dummy.updateMatrix()
      instRef.current.setMatrixAt(i, dummy.matrix)
    })
    instRef.current.instanceMatrix.needsUpdate = true

    // Update sparkles
    let ptr = 0
    for (let i = 0; i < sparkles.current.length; i++) {
      const s = sparkles.current[i]
      s.position.addScaledVector(s.velocity, dt)
      s.life -= dt
      if (s.life <= 0) {
        sparkles.current.splice(i, 1)
        i--
        continue
      }
      positionsArray[ptr++] = s.position.x
      positionsArray[ptr++] = s.position.y
      positionsArray[ptr++] = s.position.z
    }
    // zero-out remainder to avoid artifacts
    for (let j = ptr; j < positionsArray.length; j++) positionsArray[j] = 0
    pointsGeo.attributes.position.needsUpdate = true
  })

  // Click handler to “pop” + spawn sparkles
  const handlePop = (i) => {
    const b = bubbles[i]
    if (b.popped) return
    b.popped = true
    b.popTimer = 0

    // get world position of instance i
    const worldPos = new THREE.Vector3()
    instRef.current.getMatrixAt(i, dummy.matrix)
    dummy.matrix.decompose(worldPos, new THREE.Quaternion(), new THREE.Vector3())

    // spawn sparkles at worldPos
    for (let k = 0; k < 20; k++) {
      sparkles.current.push(new Sparkle(worldPos))
    }
  }

  return (
    <>
      {/* Bubbles */}
      <Instances limit={BUBBLE_COUNT} ref={instRef} castShadow receiveShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.4}
          roughness={0}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={1.2}
        />
        {Array.from({ length: BUBBLE_COUNT }).map((_, i) => (
          <Instance key={i} onClick={() => handlePop(i)} />
        ))}
      </Instances>

      {/* Sparkles */}
      <points geometry={pointsGeo}>
        <pointsMaterial size={0.05} transparent opacity={0.8} />
      </points>
    </>
  )
}
