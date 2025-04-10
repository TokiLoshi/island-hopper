// import React, { useEffect, useRef } from 'react'
// import mapboxgl from 'mapbox-gl'
// import 'mapbox-gl/dist/mapbox-gl.css'

// const MapboxExample = () => {
//   const mapContainerRef = useRef()
//   const mapRef = useRef()
//   const mapBoxToken = process.env.MAPBOX_TOKEN
//   useEffect(() => {
//     mapboxgl.accessToken = mapBoxToken
//     mapRef.current = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       center: [-74.5, 40],
//       zoom: 9, // starting zoom
//     })
//   })
//   return <div style={{ height: '100' }} ref={mapContainerRef} className='map-container' />
// }

// export default MapboxExample

'use client'

import React, { useEffect, useRef, useState } from 'react'

const MapboxExample = ({ mapboxToken }) => {}
