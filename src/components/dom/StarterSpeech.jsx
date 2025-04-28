import React from 'react'
import useStore from '@/store/globalStore'
import { useRouter } from 'next/navigation'
import { ArrowRight, MapPin, Navigation } from 'lucide-react'

export default function StarterSpeech({ text, onNext, hasEnded }) {
  const setAdventureMode = useStore((state) => state.setAdventureState)
  const router = useRouter()

  const handleSolo = () => {
    setAdventureMode('solo')
    router.push('/map')
  }

  const handleGuided = () => {
    setAdventureMode('guided')
    router.push('/guided')
  }

  if (!text) return null

  return (
    <div className='speech-bubble bg-white text-black '>
      <p className='text-lg'>{text}</p>
      <div className='flex justify-center mt-4'>
        {!hasEnded && (
          <button
            className='flex items-center justify-center bg-black hover:bg-gray-800 text-white py-8 px-6 rounded transition duration-200'
            onClick={onNext}
          >
            <span className='mr-2'>Next</span>
            <ArrowRight size={20} className='ml-2' />
          </button>
        )}
      </div>
      {hasEnded && (
        <div className='flex flex-col sm:flex-row gap-3 justify-center '>
          <button
            className='flex items-center justify-center bg-violet-900 hover:bg-violet-800 text-white py-4 px-6 rounded transition duration-200'
            onClick={handleGuided}
          >
            <Navigation size={20} className='mr-2' />
            <span>Show me</span>
          </button>
          <button
            className='flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded transition duration-200'
            onClick={handleSolo}
          >
            <MapPin size={20} className='mr-2' />
            <span>I&apos;ll explore</span>
          </button>
        </div>
      )}
    </div>
  )
}
