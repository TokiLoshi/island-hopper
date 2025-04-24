'use client'

import BackgroundAudio from '@/components/dom/BackgroundAudio'
import useStore from '@/store/globalStore'
import dynamic from 'next/dynamic'

// const MapboxGlobe = dynamic(() => import('@/components/canvas/MapboxExample'), { ssr: false })
const MapboxGlobe = dynamic(() => import('@/components/canvas/MapboxExample'), { ssr: false })

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const { audioEnabled } = useStore()

  const musicPath = '/backgroundMusic/for-her-chill-upbeat-summel-travel-vlog-and-ig-music-royalty-free-use-202298.mp3'

  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <MapboxGlobe />
        {audioEnabled && <BackgroundAudio audioFilePath={musicPath} />}
      </div>
    </>
  )
}
