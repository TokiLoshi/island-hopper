import React, { useRef, useMemo, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { Instances, Instance, useCursor } from '@react-three/drei'
import { TextureLoader } from 'three'

const BUBBLE_COUNT = 10
const SPAWN_Y = -3
const DESPAWN_Y = 5
const MIN_SCALE = 0.1
const MAX_SCALE = 0.4
const BASE_SPEED = 0.1

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

class Sparkle {
  constructor(pos) {
    this.position = pos.clone()
    this.velocity = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
    this.life = THREE.MathUtils.randFloat(0.3, 0.6)
  }
}

// export const BubbleSystem = forwardRef(
//   function BubbleSystem({ sharkRef, audioEnabled }, ref) {

export default function BubbleSystem({ sharkRef, audioEnabled }) {
  const bubbles = useRef(makeBubbles()).current
  const instanceRef = useRef()
  const sparkles = useRef([])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const sparkleTexture = useLoader(TextureLoader, './kenney_particle-pack/transparent/circle_02.png')

  const [geoPoints] = useState(() => new THREE.BufferGeometry())
  const positionsArray = useMemo(() => new Float32Array(1000 * 3), [])
  geoPoints.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))

  const sharkBox = useRef(new THREE.Box3())
  const bubbleSphere = useRef(new THREE.Sphere())
  const [hovered, setHovered] = useState(false)
  useCursor(hovered /*'pointer', 'auto', document.body*/)

  // useImperativeHandle(ref, () => ({
  //   instanceRef: instanceRef.current,
  // }))

  useFrame((state, deltaTime) => {
    if (sharkRef?.current) {
      sharkBox.current.setFromObject(sharkRef.current)
    }

    bubbles.forEach((bubble, index) => {
      const bubbleTime = bubble.factor + state.clock.elapsedTime * bubble.speed

      if (bubble.popped) {
        bubble.popTimer += deltaTime
        bubble.scale = THREE.MathUtils.lerp(bubble.scale, 0, deltaTime * 6)

        if (bubble.popTimer > 0.25) {
          bubble.popped = false
          bubble.popTimer = 0
          bubble.y = SPAWN_Y
          bubble.x = THREE.MathUtils.randFloatSpread(6)
          bubble.z = THREE.MathUtils.randFloatSpread(3)
          bubble.scale = THREE.MathUtils.randFloat(MIN_SCALE, MAX_SCALE)
        }
      } else {
        bubble.y += deltaTime * BASE_SPEED * (1 + bubble.factor / 10)

        if (bubble.y > DESPAWN_Y) {
          bubble.y = SPAWN_Y
          bubble.x = THREE.MathUtils.randFloatSpread(6)
          bubble.z = THREE.MathUtils.randFloatSpread(3)
        }
      }

      dummy.position.set(
        Math.sin(bubbleTime) * 0.2 + bubble.x,
        bubble.y + Math.sin(bubbleTime * 0.5) * 0.3,
        Math.cos(bubbleTime) * 0.2 + bubble.z,
      )
      dummy.scale.setScalar(bubble.scale)
      dummy.updateMatrix()
      instanceRef.current.setMatrixAt(index, dummy.matrix)

      bubbleSphere.current.center.copy(dummy.position)
      bubbleSphere.current.radius = 0.4

      if (!bubble.popped && sharkBox.current.intersectsSphere(bubbleSphere.current)) {
        // eslint-disable-next-line no-console
        // console.log('INTERSECTION DETECTED! ', bubble)
        bubble.popped = true
        bubble.popTimer = 0
        for (let k = 0; k < 20; k++) {
          sparkles.current.push(new Sparkle(dummy.position))
        }

        handlePop(index)
      }
    })
    instanceRef.current.instanceMatrix.needsUpdate = true

    let pointer = 0
    for (let i = 0; i < sparkles.current.length; i++) {
      const sparkle = sparkles.current[i]
      sparkle.position.addScaledVector(sparkle.velocity, deltaTime)
      sparkle.life -= deltaTime
      if (sparkle.life <= 0) {
        sparkles.current.splice(i, 1)
        i--
        continue
      }
      positionsArray[pointer++] = sparkle.position.x
      positionsArray[pointer++] = sparkle.position.y
      positionsArray[pointer++] = sparkle.position.z
    }

    // zero remainder to avoid artifacts
    for (let j = pointer; j < positionsArray.length; j++) {
      positionsArray[j] = 0
    }

    geoPoints.attributes.position.needsUpdate = true

    const particleCount = pointer / 3
    geoPoints.setDrawRange(0, particleCount)
  })

  const audioRef = useRef()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('./soundEffects/bubblePoppingLouderEdit.mp3')
      audioRef.current.preload = 'auto'
    }
  }, [])

  const handlePop = (index) => {
    if (audioRef.current && audioEnabled) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error playing audio: ', error)
      })
    }
    const bubble = bubbles[index]
    if (bubble.popped) return
    bubble.popped = true
    bubble.popTimer = 0

    const worldPosition = new THREE.Vector3()
    instanceRef.current.getMatrixAt(index, dummy.matrix)
    dummy.matrix.decompose(worldPosition, new THREE.Quaternion(), new THREE.Vector3())

    for (let k = 0; k < 20; k++) {
      sparkles.current.push(new Sparkle(worldPosition))
    }
  }

  return (
    <>
      <Instances limit={BUBBLE_COUNT} ref={instanceRef} castShadow receiveShadow>
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
        {Array.from({ length: BUBBLE_COUNT }).map((_, index) => (
          <Instance
            key={index}
            onClick={() => handlePop(index)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          />
        ))}
      </Instances>
      <points geometry={geoPoints}>
        <pointsMaterial
          map={sparkleTexture}
          // alphaTest={0.5}
          sizeAttenuation={true}
          size={0.08}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

// )

// export default BubbleSystem
