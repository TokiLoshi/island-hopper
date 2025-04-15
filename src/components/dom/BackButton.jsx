'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function BackButton() {
  const router = useRouter()
  const handleOnClick = (event) => {
    event.stopPropagation()
    console.log('Navigating back to map!')
    router.refresh()
    router.push('/')
  }
  return (
    <>
      <button className='back-button' onClick={handleOnClick}>
        Back to 🌎
      </button>
    </>
  )
}
