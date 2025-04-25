export const GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Kīlauea',
        markerImageVisited: '/markers/kilauea-visited.png',
        markerImageUnVisited: '/markers/kilauea-unvisited.png',
        markerImageNext: '/markers/kilauea-next.png',
        iconSize: [80, 80],
      },
      geometry: {
        type: 'Point',
        coordinates: [-155.2833786, 19.40774256497103],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Komodo',
        markerImageVisited: '/markers/komodo-visited.png',
        markerImageUnVisited: '/markers/komodo-unvisited.png',
        markerImageNext: '/markers/komodo-next.png',
        iconSize: [80, 80],
      },
      geometry: {
        type: 'Point',
        coordinates: [119.47468273390366, -8.528087535050792],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Farallon',
        markerImageVisited: '/markers/farallon-visited.png',
        markerImageUnVisited: '/markers/farallon-unvisited.png',
        markerImageNext: '/markers/farallon-next.png',
        iconSize: [80, 80],
      },
      geometry: {
        type: 'Point',
        coordinates: [-123.00324509041576, 37.69792596395471],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Galapagos',
        markerImageVisited: '/markers/galapagos-visited.png',
        markerImageUnVisited: '/markers/galapagos-unvisited.png',
        markerImageNext: '/markers/galapagos-next.png',
        iconSize: [80, 80],
      },
      geometry: {
        type: 'Point',
        coordinates: [-90.44075279054056, -0.29511532015757685],
        visited: false,
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Tuvalu',
        markerImageVisited: '/markers/tuvalu-visited.png',
        markerImageUnVisited: '/markers/tuvalu-unvisited.png',
        markerImageNext: '/markers/tuvalu-next.png',
        iconSize: [80, 80],
      },
      geometry: {
        type: 'Point',
        coordinates: [179.1059710111884, -8.529159314585927],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Taumata­whakatangihanga­koauau­o­tamatea­turi­pukaka­piki­maunga­horo­nuku­pokai­whenua­ki­tana­tahu',
        markerImageVisited: '/markers/longestPlace-visited.png',
        markerImageUnVisited: '/markers/longestPlace-unvisited.png',
        markerImageNext: '/markers/longestPlace-next.png',
        iconSize: [80, 80],
      },
      geometry: {
        type: 'Point',
        coordinates: [176.35238864941738, -40.02640803494223],
      },
    },
  ],
}
