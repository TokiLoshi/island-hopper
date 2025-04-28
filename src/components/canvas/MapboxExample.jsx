'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { GEOJSON } from '@/data/islands'
import { useRouter } from 'next/navigation'
import useStore from '@/store/globalStore'

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

// const MAPBOX_ACCESS_TOKEN = process.env.NEXT_TEST

export default function MapboxExample() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const isUserInteracting = useRef(false)
  const spinEnabled = useRef(true)
  const router = useRouter()

  const secondsPerRevolution = useRef(240)
  const maxSpinZoom = useRef(5)
  const slowSpinZoom = useRef(3)

  const destinations = useStore((state) => state.destinations)

  const flyToLocation = (map, coordinates, locationName) => {
    spinEnabled.current = false
    const flyToOptions = {
      center: coordinates,
      zoom: 10,
      pitch: 60,
      bearing: 30,
      duration: 5000,
      essential: true,
    }
    map.flyTo(flyToOptions)

    map.once('moveend', () => {
      let routePath = `/${locationName.toLowerCase().replace(/\s+/g, '-')}`

      if (routePath === '/kīlauea') {
        routePath = '/kilauea'
      } else if (
        routePath ===
        '/taumata­whakatangihanga­koauau­o­tamatea­turi­pukaka­piki­maunga­horo­nuku­pokai­whenua­ki­tana­tahu'
      ) {
        routePath = '/longestPlace'
      }
      setTimeout(() => {
        router.push(routePath)
      }, 1000)
    })
  }

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
    if (typeof window !== 'undefined' && mapContainerRef.current) {
      if (!MAPBOX_ACCESS_TOKEN) {
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
        map.setFog({
          color: 'rgb(220, 159, 159)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.4,
        })

        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.terrain-rgb',
        })

        map.setTerrain({
          source: 'mapbox-dem',
          exaggeration: 1.5,
        })

        for (const marker of GEOJSON.features) {
          const markerName = marker.properties.name
          let simpleMarkerName = markerName.toLowerCase().replace(/\s+/g, '')

          if (markerName === 'Kīlauea') {
            simpleMarkerName = 'kilauea'
          } else if (markerName.startsWith('Taumata')) {
            simpleMarkerName = 'longestPlace'
          }

          const destination = destinations.find((dest) => dest.name === simpleMarkerName)

          const el = document.createElement('div')
          el.className = 'marker'
          // const size = 50
          const size = marker.properties.iconSize || [50, 50]
          el.style.width = `${size[0]}px`
          el.style.height = `${size[0]}px`
          el.style.backgroundSize = 'cover'
          el.style.cursor = 'pointer'
          el.style.borderRadius = '50%'
          el.style.backgroundColor = 'transparent'
          el.style.backgroundPosition = 'center'

          const offSetY = -size[1] / 2

          if (destination && destination.visited) {
            el.style.backgroundImage = `url(${marker.properties.markerImageVisited})`
            el.style.opacity = '0.7'
          } else {
            el.style.backgroundImage = `url(${marker.properties.markerImageUnVisited})`
          }

          const popUpContent = `
          <div>
          <h2>${marker.properties.name}</h2>
          <button id="visit-${marker.properties.name.toLowerCase()}"
          class="fly-button">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane-icon lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
          <span>  Visit!</span>
          </button>
          <div>`

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: true,
            className: 'custom-mapbox-popup',
          })

          popup.setHTML(popUpContent)

          const markerObj = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
            rotationAlignment: 'horizon',
            offset: [25, offSetY],
          })
            .setLngLat(marker.geometry.coordinates)
            .setPopup(popup)
            .addTo(mapRef.current)

          popup.on('open', () => {
            document.getElementById(`visit-${marker.properties.name.toLowerCase()}`)?.addEventListener('click', () => {
              popup.remove()
              flyToLocation(map, marker.geometry.coordinates, marker.properties.name)
            })
          })
        }
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
    // eslint-disable-next-line
  }, [router])

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
