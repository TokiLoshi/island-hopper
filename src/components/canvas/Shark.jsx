/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useCursor, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '@/store/globalStore'

const ACTION_MAP = {
  bite: 'SharkArmature|SharkArmature|SharkArmature|Swim_Bite|SharkArmature|Swim_Bite',
  swimFast: 'SharkArmature|SharkArmature|SharkArmature|Swim_Fast|SharkArmature|Swim_Fast',
  swim: 'SharkArmature|SharkArmature|SharkArmature|Swim|SharkArmature|Swim',
  swimBite: 'SharkArmature|SharkArmature|SharkArmature|Swim_Bite|SharkArmature|Swim_Bite',
}

const IDLE_ANIMATION_KEY = 'swim'
const TRANSITION_DURATION = 0.08
export const Shark = forwardRef(function Shark({ currentAnimation = IDLE_ANIMATION_KEY, ...props }, ref) {
  const groupRef = useRef()

  useImperativeHandle(ref, () => groupRef.current)

  const { nodes, materials, animations } = useGLTF('/models/Shark.glb')
  const { actions } = useAnimations(animations, groupRef)

  const [isClicked, setIsClicked] = useState(false)

  const currentActionRef = useRef(null)
  const timeoutRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered /*'pointer', 'auto', document.body*/)

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const playIdleAnimation = () => {
      const idleAnimationName = ACTION_MAP[IDLE_ANIMATION_KEY]
      if (!idleAnimationName || !actions[idleAnimationName]) {
        // eslint-disable-next-line no-console
        console.warn(`No animation found for ${idleAnimationName}`)
        return
      }

      const idleAction = actions[idleAnimationName]

      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(TRANSITION_DURATION)
      }
      idleAction.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(TRANSITION_DURATION)

      currentActionRef.current = idleAction
      setIsClicked(false)
    }

    const playRequestedAnimation = (animationKey) => {
      if (animationKey === IDLE_ANIMATION_KEY && currentActionRef.current === actions[ACTION_MAP[IDLE_ANIMATION_KEY]])
        return
      const fullAnimationName = ACTION_MAP[animationKey]
      if (!fullAnimationName) {
        // eslint-disable-next-line no-console
        console.warn(`Animation not found: ${fullAnimationName}`)
        playIdleAnimation()
        return
      }

      const targetAction = actions[fullAnimationName]
      if (currentActionRef.current) {
        currentActionRef.current.fadeOut(TRANSITION_DURATION)
      }

      if (animationKey === IDLE_ANIMATION_KEY) {
        targetAction.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(TRANSITION_DURATION).play()
      } else {
        targetAction.reset().setLoop(THREE.LoopRepeat, 1).fadeIn(TRANSITION_DURATION).play()

        const duration = targetAction.getClip().duration * 1000
        timeoutRef.current = setTimeout(
          () => {
            playIdleAnimation()
          },
          duration + TRANSITION_DURATION * 1000,
        )
      }

      currentActionRef.current = targetAction
    }

    playRequestedAnimation(currentAnimation)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentAnimation, actions, isClicked])

  const { audioEnabled, dialogAudioPlaying } = useStore()

  const audioRef = useRef()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('./soundEffects/snapSnap.mp3')
      audioRef.current.preload = 'auto'
    }
  }, [])

  const handleClick = (event) => {
    event.stopPropagation()
    if (audioRef.current && audioEnabled && !dialogAudioPlaying) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error playing shark audio: ', error)
      })
    }

    setIsClicked(true)

    if (currentActionRef.current) {
      currentActionRef.current.fadeOut(TRANSITION_DURATION)
    }
    const actionName = ACTION_MAP['bite']
    const actionToPlay = actions[actionName]
    actionToPlay.reset().setLoop(THREE.LoopRepeat, 2).fadeIn(TRANSITION_DURATION).play()
    const duration = actionToPlay.getClip().duration * 1000 * 2

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(
      () => {
        const idleAnimationName = ACTION_MAP[IDLE_ANIMATION_KEY]
        const idleAction = actions[idleAnimationName]
        if (currentActionRef.current) {
          currentActionRef.current.fadeOut(TRANSITION_DURATION)
        }
        idleAction.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(TRANSITION_DURATION).play()
        currentActionRef.current = idleAction
        setIsClicked(false)
      },
      duration + TRANSITION_DURATION * 10000,
    )
    currentActionRef.current = actionToPlay
  }

  return (
    <group
      ref={groupRef}
      {...props}
      dispose={null}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group name='Root_Scene'>
        <group name='RootNode'>
          <group name='SharkArmature' rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Root} />
            <primitive object={nodes.Abdomen} />
            <primitive object={nodes.Center} />
          </group>
          <skinnedMesh
            name='Shark'
            geometry={nodes.Shark.geometry}
            material={materials.AtlasMaterial}
            skeleton={nodes.Shark.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
          <skinnedMesh
            name='Shark001'
            geometry={nodes.Shark001.geometry}
            material={materials.AtlasMaterial}
            skeleton={nodes.Shark001.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/models/Shark.glb')
export default Shark
