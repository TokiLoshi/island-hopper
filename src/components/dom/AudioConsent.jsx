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
    <div className='fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4'>
      <div className='bg-slate-900 text-slate-200 text-center rounded-lg p-6 max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Island Hopper</h2>
        <p className='mb-6 '>
          To get the most out of this 3D map experience would you like to enable the recommended guided audio?
        </p>
        <div className='flex justify-center space-x-4'>
          <button
            onClick={handleAccept}
            className='px-6 py-2 bg-neutral-100 text-slate-900 rounded-lg hover:bg-green-300 transition-colors'
          >
            <Volume2 />
          </button>
          <button
            onClick={handleDecline}
            className='px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-rose-300 transition-colors'
          >
            <VolumeOff />
          </button>
        </div>
      </div>
    </div>
  )
}
