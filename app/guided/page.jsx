'use client'

import dynamic from 'next/dynamic'

const GuidedMapboxGlobe = dynamic(() => import('@/components/canvas/GuidedMapboxGlobe'), { ssr: false })

export default function GuidedPage() {
  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <GuidedMapboxGlobe />
      </div>
    </>
  )
}
