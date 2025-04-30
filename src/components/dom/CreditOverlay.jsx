import { ArrowBigDown, AtSign, Code, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function CreditOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  const toggleCard = (event) => {
    event.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        onClick={toggleCard}
        className='z-50 fixed right-4 top-4 m-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-slate-800 text-white transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg md:right-8 md:top-8 lg:right-20 lg:top-20'
        style={{
          touchAction: 'manipulation',
        }}
      >
        {isOpen ? <X size={20} /> : <AtSign size={20} />}
      </button>
      <div
        ref={cardRef}
        className={`duration-500 fixed right-4 z-40 w-full max-w-md rounded-lg bg-slate-800 text-white shadow-xl transition-all ease-in-out md:right-8 lg:right-20 ${isOpen ? 'top-20 opacity-100 md:top-24 lg:top-36' : '-top-96 opacity-0'}`}
      >
        <div className='p-6 max-h-[60vh] overflow-y-auto'>
          <h2 className='mb-4 ms-2 text-center text-2xl font-bold text-gray-200'>Credits</h2>
          <div className='space-y-4'>
            <div className='rounded-md bg-slate-100 p-4'>
              <h3 className='text-lg font-medium text-slate-600'>
                <a
                  href='https://github.com/TokiLoshi/island-hopper'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-block hover:text-blue-500 hover:underline'
                >
                  <Code className='mt-2' />
                </a>{' '}
                by{' '}
                <a
                  href='https://github.com/TokiLoshi'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-block hover:text-blue-500 hover:underline'
                >
                  TokiLoshi
                </a>
              </h3>{' '}
              <p className='text-slate-600'>Made for Three.js Journey Challenge</p>
            </div>

            <div className='rounded-md bg-slate-100 p-4'>
              <h3 className='text-lg font-medium text-slate-700'>Assets</h3>
              <ul className='mt-2 space-y-1 text-slate-600'>
                <li>
                  Shark, Rabbit with Pigtails, Dragon and Dolphin by{' '}
                  <a
                    href='https://poly.pizza/u/Quaternius'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    Quaternius{' '}
                  </a>
                  via{' '}
                  <a
                    href='https://poly.pizza'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    PolyPizza{' '}
                  </a>
                </li>
                <li>
                  Volcano, Tortoise, Boat, and Boombox by{' '}
                  <a
                    href='https://poly.pizza/u/Poly%20by%20Google'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    Poly by Google{' '}
                  </a>
                  via{' '}
                  <a
                    href='https://poly.pizza'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    PolyPizza
                  </a>
                </li>
                <li>
                  WoodenSign{' '}
                  <a
                    href='https://poly.pizza/u/iPoly3D'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    iPoly3D{' '}
                  </a>
                  via{' '}
                  <a
                    href='https://poly.pizza'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    PolyPizza
                  </a>
                </li>
                <li>
                  Maps and Map animations including snow and rain shaders{' '}
                  <a
                    href='https://docs.mapbox.com/mapbox-gl-js/api/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    MapboxGL{' '}
                  </a>
                </li>
                <li>
                  Background music track for Starter Map by{' '}
                  <a
                    href='https://pixabay.com/users/pufino-47222373/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=318954/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    by Pufino{' '}
                  </a>
                  via{' '}
                  <a
                    href='https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=318954'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    PixaBay{' '}
                  </a>
                </li>
                <li>
                  Background music track for Starter May by{' '}
                  <a
                    href='https://docs.mapbox.com/mapbox-gl-js/api/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    by Pufino{' '}
                  </a>
                  via{' '}
                  <a
                    href='https://docs.mapbox.com/mapbox-gl-js/api/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    PixaBay{' '}
                  </a>
                </li>
              </ul>
            </div>

            <div className='rounded-md bg-slate-100 p-4'>
              <h3 className='text-lg font-medium text-slate-700'>Sources</h3>
              <p className='text-slate-600'>
                <span className='font-semibold'>Facts:</span> sources for each dialog available on
                <a
                  href='https://github.com/TokiLoshi'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-block text-slate-600 hover:text-blue-500 hover:underline'
                >
                  GitHub README
                </a>
              </p>
              <p className='text-slate-600'>
                <span className='font-semibold'>Sound Effects:</span> generated with AI on{' '}
                <a
                  href='https://github.com/TokiLoshi'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-block text-slate-600 hover:text-blue-500 hover:underline'
                >
                  11 Labs.
                </a>
                Text for the prompts are available on the GitHub READEME.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
