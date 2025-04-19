'use client'

import dynamic from 'next/dynamic'

const PlainMapboxGlobe = dynamic(() => import('@/components/canvas/PlainMapboxGlobe'), { ssr: false })

export default function GuidedPage() {
  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <PlainMapboxGlobe />
      </div>
    </>
  )
}
