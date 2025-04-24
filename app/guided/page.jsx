'use client'

import dynamic from 'next/dynamic'
import useStore from '@/store/globalStore'
import BackgroundAudio from '@/components/dom/BackgroundAudio'

const GuidedMapboxGlobe = dynamic(() => import('@/components/canvas/GuidedMapboxGlobe'), { ssr: false })

export default function GuidedPage() {
  const { audioEnabled } = useStore()
  const musicPath = '/backgroundMusic/vibing-chill-lofi-royalty-free-music-318954.mp3'

  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <GuidedMapboxGlobe />
        {audioEnabled && <BackgroundAudio audioFilePath={musicPath} />}
      </div>
    </>
  )
}
