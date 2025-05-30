/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { animated, useSpring } from '@react-spring/three'

const SWIMMING = 'Armature|Swim'
const TRANSITION_DURATION = 0.1

export function Dolphin2(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/Dolphin2.glb')
  const { actions } = useAnimations(animations, group)

  const actionRef = useRef(null)

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return
    if (actions[SWIMMING]) {
      const dolphinSwim = actions[SWIMMING]
      dolphinSwim.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(TRANSITION_DURATION).play()
    }
    return () => {
      if (actions[SWIMMING]) {
        actions[SWIMMING].fadeOut()
      }
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Root_Scene'>
        <group name='RootNode'>
          <group name='Armature' position={[0, 0.533, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Root} />
          </group>
          <group name='Dolphin' position={[0, 0.335, 0.369]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name='Dolphin_1'
              geometry={nodes.Dolphin_1.geometry}
              material={materials.Bottom}
              skeleton={nodes.Dolphin_1.skeleton}
            />
            <skinnedMesh
              name='Dolphin_2'
              geometry={nodes.Dolphin_2.geometry}
              material={materials.Top}
              skeleton={nodes.Dolphin_2.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/Dolphin2.glb')
