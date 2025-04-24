import React from 'react'
import useStore from '@/store/globalStore'
import { Volume2, VolumeOff } from 'lucide-react'

export default function AudioConsent() {
  const { userInteracted, setUserInteracted, setAudioEnabled, setBackgroundMusicEnabled } = useStore()

  if (userInteracted) return null

  const handleAccept = () => {
    setUserInteracted()
    setAudioEnabled(true)
    setBackgroundMusicEnabled(true)
  }

  const handleDecline = () => {
    setUserInteracted()
    setAudioEnabled(false)
    setBackgroundMusicEnabled(false)
  }

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center p-4 bg-black/70'>
      <div className='max-w-md rounded-lg p-6 bg-slate-900 text-slate-200 text-center  '>
        <h2 className='text-2xl font-bold mb-4'>Island Hopper</h2>
        <p className='mb-6 '>
          To get the most out of this 3D map experience would you like to enable the recommended guided audio?
        </p>
        <div className='flex justify-center space-x-4'>
          <button
            onClick={handleAccept}
            className='rounded-lg px-6 py-2 bg-neutral-100 text-slate-900 transition-colors hover:bg-green-300 '
          >
            <Volume2 />
          </button>
          <button
            onClick={handleDecline}
            className='rounded-lg px-6 py-2 bg-gray-300 text-gray-800 transition-colors hover:bg-rose-300 '
          >
            <VolumeOff />
          </button>
        </div>
      </div>
    </div>
  )
}
