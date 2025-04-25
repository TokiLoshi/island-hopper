'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import useStore from '@/store/globalStore'
import { useEffect } from 'react'
import { Map } from 'lucide-react'

export default function BackButton({ userAdventureMode }) {
  const router = useRouter()
  const getVisitedDestinations = useStore((state) => state.getVisitedDestinations)
  const allDestinations = useStore((state) => state.destinations)

  const handleOnClick = (event) => {
    event.stopPropagation()
    const visitedDestinations = getVisitedDestinations()
    if (visitedDestinations.length === allDestinations.length) {
      router.push('/end')
      return
    }

    if (userAdventureMode === 'solo') {
      router.push('/map')
    } else if (userAdventureMode === 'guided') {
      router.push('/guided')
    } else {
      // eslint-disable-next-line no-console
      console.error('Unexpected mode: ', userAdventureMode)
    }
  }
  return (
    <>
      {/* <button className='back-button' onClick={handleOnClick}>
        Back to 🌎
      </button> */}
      <button className='back-button' onClick={handleOnClick}>
        Back to Map
        <span className='ms-2'>
          {' '}
          <Map />
        </span>
      </button>
    </>
  )
}
