// 'use client'

// import { useEffect, useRef } from 'react'
// import mapboxgl from 'mapbox-gl'
// import 'mapbox-gl/dist/mapbox-gl.css'

// export default function MapboxGlobe() {
//   const mapContainer = useRef(null)
//   const map = useRef(null)

//   useEffect(() => {
//     if (map.current) return

//     mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/satellite-v9',
//       projection: 'globe',
//       zoom: 1.5,
//       center: [0, 20],
//     })
//     map.current.addControl(new mapboxgl.NavigationControl())
//     map.current.on('style.load', () => {
//       map.current.setFog({
//         color: 'rgb(186, 210, 235)',
//         'high-color': 'rgb(36, 92, 223)',
//         'horizon-blend': 0.02,
//         'space-color': 'rgb(11, 11, 25)',
//         'star-intensity': 0.6,
//       })
//     })
//     return () => {
//       if (map.current) {
//         map.current.remove()
//       }
//     }
//   }, [])
//   return (
//     <div className='map-container'>
//       <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
//     </div>
//   )
// }

'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function MapboxGlobe() {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return

    // Access the public environment variable
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    // For debugging - to see if the token is available
    console.log('Token available:', !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN)

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
    })

    map.current.addControl(new mapboxgl.NavigationControl())

    map.current.on('style.load', () => {
      map.current.setFog({
        color: 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6,
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  return (
    <div className='map-container'>
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </div>
  )
}
