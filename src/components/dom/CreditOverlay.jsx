import { ArrowBigDown, AtSign, CircleDot, Code, Palette, Search, X } from 'lucide-react'
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
        className='fixed right-4 top-4 z-50 m-2 flex size-12 cursor-pointer items-center justify-center rounded-full bg-slate-800 text-white transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg md:right-8 md:top-8 lg:right-20 lg:top-20'
        style={{
          touchAction: 'manipulation',
        }}
      >
        {isOpen ? <X size={20} /> : <AtSign size={20} />}
      </button>
      <div
        ref={cardRef}
        className={`fixed right-4 z-40 w-full max-w-md rounded-lg bg-slate-800 text-white shadow-xl transition-all duration-500 ease-in-out md:right-8 lg:right-20 ${isOpen ? 'top-20 opacity-100 md:top-24 lg:top-36' : '-top-96 opacity-0'}`}
      >
        <div className='max-h-[60vh] overflow-y-auto p-6'>
          <h2 className='mb-4 ms-2 text-center text-2xl font-bold text-gray-200'>Thanks for visiting!</h2>
          <div className='space-y-4'>
            <div className='rounded-md bg-slate-100 p-4 text-center'>
              <h2 className='text-center text-lg font-medium text-slate-600'>
                <Code className='mt-2 items-center' />
                <a
                  href='https://github.com/TokiLoshi/island-hopper'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-block text-lg hover:text-blue-500 hover:underline'
                >
                  Island Hopper
                </a>
              </h2>

              <h3 className='text-center font-semibold text-slate-600'>
                made with 😁 by{' '}
                <a
                  href='https://github.com/TokiLoshi'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-block text-sm font-semibold hover:text-blue-500 hover:underline'
                >
                  TokiLoshi (Bee🐝)
                </a>
              </h3>
              <p className='text-sm text-slate-600'>
                <a
                  href='https://github.com/pmndrs/react-three-next'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-2 inline-block text-sm font-semibold hover:text-blue-500 hover:underline'
                >
                  Next.js (pmndrs starter kit),
                </a>
                Mapbox GL, Zustand, R3F, Rapier, React Spring, Leva, Perf. Made for Three.js Journey Challenge #17
              </p>
            </div>

            <div className='rounded-md bg-slate-100 p-4'>
              <h3 className='text-center text-lg font-medium text-slate-700'>
                <Palette /> Assets
              </h3>
              <ul className='mt-2 space-y-1 text-slate-600'>
                <li className='inline-block'>
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
                  Background music track for Starter Map by{' '}
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
                <li>
                  Bubble Particles from
                  <a
                    href='https://www.kenney.nl/assets/particle-pack'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    Kenney&apos;s Particle Pack{' '}
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
                <li>
                  Pronunciation for longest named place by MecanautesRecorder via{' '}
                  <a
                    href='https://commons.wikimedia.org/wiki/File:LL-Q150_(fra)-Mecanautes-taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu.wav'
                    target='_blank'
                    rel='noopener noreferrer'
                    className=' text-blue-500 hover:underline'
                  >
                    Wikimedia commons{' '}
                  </a>
                </li>
              </ul>
            </div>

            <div className='rounded-md bg-slate-100 p-4'>
              <h3 className='text-center text-lg font-medium text-slate-700'>
                <Search />
                Sources
              </h3>
              <p className='text-slate-600'>
                Corny dialog was written by the developer, with full recognition that it might have been more
                interesting had AI written it but she hopes you had fun anyway. Everything was researched and sources
                are referenced in full on the GitHub README.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
