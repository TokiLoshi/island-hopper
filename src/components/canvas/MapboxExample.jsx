'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
// const MAPBOX_ACCESS_TOKEN = process.env.NEXT_TEST

export default function MapboxExample() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const isUserInteracting = useRef(false)
  const spinEnabled = useRef(true)

  const secondsPerRevolution = useRef(240)
  const maxSpinZoom = useRef(5)
  const slowSpinZoom = useRef(3)

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
    if (typeof window !== 'undefined' && mapContainerRef.current) {
      if (!MAPBOX_ACCESS_TOKEN) {
        console.error('Mapbox access token is missing')
        mapContainerRef.current.innerHTML =
          '<p style: red; text-align: center; padding: 20px>Mapbox access token missing </p>'
        return
      }

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        projection: { name: 'globe' },
        zoom: 1.5,
        center: [-90, 40],
      })

      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl())
      // map.scrollZoom.disable()

      const spinGlobe = () => {
        if (!mapRef.current) return

        const zoom = map.getZoom()

        if (spinEnabled.current && !isUserInteracting.current && zoom < maxSpinZoom.current) {
          let distancePerSecond = 360 / secondsPerRevolution.current
          if (zoom > slowSpinZoom.current) {
            const zoomDif = (maxSpinZoom.current - zoom) / (maxSpinZoom.current - slowSpinZoom.current)
            distancePerSecond *= zoomDif
          }
          const center = map.getCenter()
          center.lng -= distancePerSecond
          map.easeTo({ center, duration: 1000, easing: (n) => n })
        }
      }
      map.on('style.load', () => {
        if (!mapRef.current) return
        map.setFog({})
        spinGlobe()
      })
      map.on('mousedown', () => {
        isUserInteracting.current = true
      })
      map.on('dragstart', () => {
        isUserInteracting.current = true
      })
      map.on('mouseup', () => {
        isUserInteracting.current = false
        spinGlobe()
      })

      map.on('moveend', () => {
        if (!mapRef.current) return
        spinGlobe()
      })
      map.on('touchend', () => {
        isUserInteracting.current = false
        spinGlobe()
      })
      // CleanUp
      return () => {
        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
        }
      }
    }
  }, [])
  return (
    <div
      ref={mapContainerRef}
      style={{
        position: 'relative',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100vh',
      }}
    ></div>
  )
}
