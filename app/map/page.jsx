'use client'

import dynamic from 'next/dynamic'

// const MapboxGlobe = dynamic(() => import('@/components/canvas/MapboxExample'), { ssr: false })
const MapboxGlobe = dynamic(() => import('@/components/canvas/MapboxExample'), { ssr: false })

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <MapboxGlobe />
      </div>
    </>
  )
}
