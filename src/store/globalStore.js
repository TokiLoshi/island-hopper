import { create } from 'zustand'

const useStore = create((set, get) => ({
  destinations: [
    { name: 'farallon', visited: false },
    { name: 'galapagos', visited: false },
    { name: 'kilauea', visited: false },
    { name: 'komodo', visited: false },
    { name: 'longestPlace', visited: false },
    { name: 'tuvalu', visited: false },
  ],
  adventureMode: 'solo',

  setAdventureState: (adventureChoice) => set({ adventureMode: adventureChoice }),
  markDestinationVisited: (visitedName) =>
    set((state) => {
      const targetIndex = state.destinations.findIndex((dest) => dest.name === visitedName)
      if (targetIndex === -1 || state.destinations[targetIndex].visited) {
        return state
      }
      return {
        destinations: state.destinations.map((dest, index) =>
          index === targetIndex ? { ...dest, visited: true } : dest,
        ),
      }
    }),
  getNextDestination: () => {
    const { destinations } = get()
    return destinations.find((dest) => !dest.visited) || null
  },

  getVisitedDestinations: () => {
    const { destinations } = get()
    return destinations.filter((dest) => dest.visited)
  },
}))

export default useStore
