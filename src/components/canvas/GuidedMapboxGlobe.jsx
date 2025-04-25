'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { GEOJSON } from '@/data/islands'
import { useRouter } from 'next/navigation'
import useStore from '@/store/globalStore'

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

// const MAPBOX_ACCESS_TOKEN = process.env.NEXT_TEST

export default function GuidedMapboxGlobe() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const isUserInteracting = useRef(false)
  const spinEnabled = useRef(true)
  const router = useRouter()

  const secondsPerRevolution = useRef(240)
  const maxSpinZoom = useRef(5)
  const slowSpinZoom = useRef(3)

  const destinations = useStore((state) => state.destinations)
  const getNextDestination = useStore((state) => state.getNextDestination)
  const nextDestination = getNextDestination()
  const nextLocationName = nextDestination ? nextDestination.name : null
  // eslint-disable-next-line no-console
  // console.log('next destination name: ', nextDestination)

  const flyToLocation = (map, coordinates, locationName) => {
    spinEnabled.current = false
    const flyToOptions = {
      center: coordinates,
      zoom: 10,
      pitch: 60,
      bearing: 30,
      duration: 3000,
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

      let initialCenter = [-90, 40]

      if (nextDestination) {
        const nextLocationFeature = GEOJSON.features.find((feature) => {
          let simpleName = feature.properties.name.toLowerCase()
          if (feature.properties.name === 'Kīlauea') {
            simpleName = 'kilauea'
          } else if (feature.properties.name.startsWith('Taumata')) {
            simpleName = 'longestPlace'
          }
          return simpleName === nextDestination.name
        })
        if (nextLocationFeature && nextLocationFeature.geometry.coordinates) {
          initialCenter = nextLocationFeature.geometry.coordinates
        }
      }

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        projection: { name: 'globe' },
        zoom: 1.5,
        center: initialCenter,
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

          if (destination && !destination.visited && simpleMarkerName !== nextLocationName) {
            continue
          }

          const el = document.createElement('div')
          el.className = 'marker'
          const size = marker.properties.iconSize || [50, 50]
          el.style.width = `${size[0]}px`
          el.style.height = `${size[0]}px`
          el.style.backgroundSize = 'cover'
          el.style.cursor = 'pointer'
          el.style.borderRadius = '50%'
          el.backgroundColor = 'transparent'
          el.style.backgroundPosition = 'center'

          const offsetY = -size[1] / 2

          if (destination && destination.visited) {
            el.style.backgroundImage = `url(${marker.properties.markerImageVisited})`
            el.style.opacity = '0.7'
          } else if (simpleMarkerName === nextLocationName) {
            el.style.backgroundImage = `url(${marker.properties.markerImageNext})`
            el.style.filter = 'hue-rotate(0deg)'
          } else {
            el.style.backgroundImage = `url(${marker.properties.markerImageUnVisited})`
          }

          if (simpleMarkerName === nextLocationName) {
            const popUpContent = `
            <div style="padding: 10px 20px; text-align: center; border-radius: 8px; background-color: rgba(255, 255, 255, 0); box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); font-family: sans-serif;">
              <h2 style="margin-bottom: 15px; margin-top: 5px; color: #333; ">Your next stop: ${marker.properties.name}</h2>
              <button
                id="visit-${markerName.toLowerCase()}"
                style="background-color: #663399; color: white; solid 1px purple; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1rem;"
              >
                Lets go!
              </button>
            </div>`

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
              offset: [25, offsetY],
            })
              .setLngLat(marker.geometry.coordinates)
              .setPopup(popup)
              .addTo(mapRef.current)

            popup.on('open', () => {
              document
                .getElementById(`visit-${marker.properties.name.toLowerCase()}`)
                ?.addEventListener('click', () => {
                  popup.remove()
                  flyToLocation(map, marker.geometry.coordinates, marker.properties.name)
                })
            })
          } else {
            new mapboxgl.Marker({
              element: el,
              rotationAlignment: 'horizon',
              anchor: 'center',
              offset: [25, offsetY],
            })
              .setLngLat(marker.geometry.coordinates)
              .addTo(mapRef.current)
          }
          spinGlobe()
        }
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
  }, [router, destinations, nextLocationName])

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
