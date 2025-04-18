import { create } from 'zustand'

const useStore = create((set) => ({
  destinations: ['farallon', 'galapagos', 'kilauae', 'komodo', 'longestPlace', 'tuvalu'],
  adventureMode: null,

  setAdventureState: (adventureChoice) => set({ adventureMode: adventureChoice }),
}))

export default useStore
