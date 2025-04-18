/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, forwardRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export function Boombox({ ...props }) {
  const { nodes, materials } = useGLTF('/models/Boombox.glb')
  const [introAudio, setIntroAudio] = useState(null)
  const boomRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/voiceover.wav')
      audio.preload = 'auto'
      setIntroAudio(audio)
      const handleEnded = () => setIsPlaying(false)
      audio.addEventListener('ended', handleEnded)

      return () => {
        audio.pause()
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  const handleBoomboxClick = (event) => {
    event.stopPropagation()
    if (!introAudio) {
      return
    }
    if (isPlaying) {
      introAudio.pause()

      setIsPlaying(false)
    } else {
      introAudio.play().catch((error) => {
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  return (
    <group {...props} dispose={null} onClick={handleBoomboxClick}>
      <mesh castShadow receiveShadow geometry={nodes.Boombox_mesh.geometry} material={materials.Boombox_mat} />
    </group>
  )
}
Boombox.displayName = 'Boombox'
useGLTF.preload('/models/Boombox.glb')
