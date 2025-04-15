import React from 'react'

export default function SpeechBubble({ text, onNext, hasEnded }) {
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
    </div>
  )
}
