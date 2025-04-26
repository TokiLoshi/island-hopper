import { Shadow, MeshDistortMaterial, Float } from '@react-three/drei'

export function Bubble({ iridescenceThicknessRangeX, iridescenceThicknessRangeY, ...props }) {
  return (
    <Float floatIntensity={1.5} speed={0.5}>
      <Shadow scale={2} position={[0, -1.35, 0]} opacity={0.15} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          distort={0.25}
          transmission={1.05}
          thickness={-0.5}
          roughness={0}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[iridescenceThicknessRangeX, iridescenceThicknessRangeY]}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </Float>
  )
}
