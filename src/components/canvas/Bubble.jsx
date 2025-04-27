import { Environment, Shadow, MeshDistortMaterial, Float, MeshReflectorMaterial } from '@react-three/drei'

// // Inspiration: https://codesandbox.io/p/sandbox/focused-kirch-9dyrgh?file=%2Fsrc%2FApp.js
export function Bubble({
  bubblePositionX = 0,
  bubblePositionY = 0,
  bubblePositionZ = 0,
  bubbleScale = 1,
  distort = 0.25,
  transmission = 1.05,
  thickness = -0.5,
  roughness = 0,
  iridescence = 1,
  iridescenceIOR = 1,
  iridescenceThicknessRangeX = 0,
  iridescenceThicknessRangeY = 1200,
  clearcoat = 1,
  clearcoatRoughness = 0,
  envMapIntensity = 1,
  ...props
}) {
  return (
    <>
      <Float floatIntensity={1.5} speed={0.5}>
        <Shadow scale={2} position={[0, -1.35, 0]} opacity={0.15} />
        <mesh
          position-x={bubblePositionX}
          position-y={bubblePositionY}
          position-z={bubblePositionZ}
          scale={bubbleScale}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <MeshDistortMaterial
            distort={distort}
            transmission={transmission}
            thickness={thickness}
            roughness={roughness}
            iridescence={iridescence}
            iridescenceIOR={iridescenceIOR}
            iridescenceThicknessRange={[iridescenceThicknessRangeX, iridescenceThicknessRangeY]}
            clearcoat={clearcoat}
            clearcoatRoughness={clearcoatRoughness}
            envMapIntensity={envMapIntensity}
          />
        </mesh>
      </Float>
    </>
  )
}
