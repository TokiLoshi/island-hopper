import React from 'react'

export default function SpeechBubble({ text, onNext }) {
  if (!text) return null

  return (
    <div className='speech-bubble'>
      <p>{text}</p>
      <button onClick={onNext}>Next</button>
    </div>
  )
}
