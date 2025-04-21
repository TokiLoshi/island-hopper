import React from 'react'
import useStore from '@/store/globalStore'
import { useRouter } from 'next/navigation'

export default function StarterSpeech({ text, onNext, hasEnded }) {
  const setAdventureMode = useStore((state) => state.setAdventureState)
  const router = useRouter()

  const handleSolo = () => {
    // eslint-disable-next-line no-console
    console.log('User wants to go solo')
    setAdventureMode('solo')
    router.push('/map')
  }

  const handleGuided = () => {
    // eslint-disable-next-line no-console
    console.log('User wants to be guided')
    setAdventureMode('guided')
    router.push('/guided')
  }

  if (!text) return null

  return (
    <div className='speech-bubble'>
      <p>{text}</p>
      {!hasEnded && (
        <button
          style={{
            borderRadius: '5px',
            border: '1 solid white',
            backgroundColor: 'black',
            color: 'whitesmoke',
          }}
          onClick={onNext}
        >
          Next
        </button>
      )}
      {hasEnded && (
        <div>
          <button
            style={{
              borderRadius: '5px',
              border: '1 solid white',
              backgroundColor: 'dodgerblue',
              color: 'whitesmoke',
            }}
            onClick={handleGuided}
          >
            Show me
          </button>
          <button
            style={{
              borderRadius: '5px',
              border: '1 solid white',
              backgroundColor: 'mediumpurple',
              color: 'whitesmoke',
              marginLeft: '5px',
            }}
            onClick={handleSolo}
          >
            I will choose
          </button>
        </div>
      )}
    </div>
  )
}
