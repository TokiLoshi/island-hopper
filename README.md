# island-hopper

This project was bootstrapped with [`create-r3f-app`](https://github.com/utsuboco/create-r3f-app)

Created for three.js journey

# Stack

Next.js starter kit by [pmndrs](https://github.com/pmndrs/react-three-next)
Mapbox with [threebox](https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model-threebox/)
Gltfjsx by [pmndrs](https://gltf.pmnd.rs/)

Voiceovers generated with eleven labs

#TODO:

# Islands of Interest

1. Kīlauea - Island with errupting volcano (19.40774256497103, -155.2833786)
2. Komodo - Komodo Dragon (-8.528087535050792, 119.47468273390366)
3. Farallon Island - Sharks (37.69792596395471, -123.00324509041576)
4. Gallapagos Islands Tortoise (-0.29511532015757685, -90.44075279054056)
5. Tuvalu - Threatened by Climate change (-8.529159314585927, 179.1059710111884)
6. Madagascar - Lemurs or cyclones or Baobabs (-23.174115943183764, 43.628544161992366)
7. Taumata­whakatangihanga­koauau­o­tamatea­turi­pukaka­piki­maunga­horo­nuku­pokai­whenua­ki­tana­tahu
   The longest place

## DONE

- [x] Create Repo
- [x] Deploy
- [x] Decide on specs for MVP
- [x] Get set up with Mapbox and add API key to deployed environment
- [x] Review these tutorials https://docs.mapbox.com/mapbox-gl-js/guides/install/
- [x] Create Globe starter
- [x] Choose Islands of interest and get coordinates
- [x] create a GeoJeojson object with coordinates
- [x] load in the markers and orient them towards the horizon
- [x] Add a button to each marker and then use router to go to new page, finish setting up router
- [x] Fly to Effect on Click load new route with route and fly to with a different style
- [x] Choose models for each island
- [x] Render 3D models and map base for Kilauea
- [x] Create companion to go with you to each Island (choose a animated C0 model)
- [x] Fix animations on dialogs on longestPlace
- [x] Add starter dialogs to everything
- [x] Add back buttons to everything
- [x] Add bunny to Gallapagos, Kileau
- [x] Add Dialog and animations to farallon
- [x] Add maps to Farallon
- [x] Add Dialog to Galapagos
- [x] Add maps to the Gallapagos
- [x] Add back Dialog to Kilauea
- [x] Add Dialog to Tuvalu
- [ ] Add animations to Tuvalu

## Still to do

- [ ] Add maps to Tuvalu
- [ ] Add Maps to Komodo
- [ ] Grammarly all the dialogs
- [ ] Generate voice overs with eleven labs
- [ ] Edit the voice over into clips with the dialog
- [ ] Install Zustand
- [ ] Set global state to whether user wants audio or not
- [ ] Get audio button to show next to the dialogs
- [ ] Toggle audio state
- [ ] Add a play button next to each dialog
- [ ] Generate play component to play the dialog passed in as props
- [ ] Animate the sprite for the Turtle so that it looks like it walks back and forth
- [ ] Add animations to onClicks for all models
- [ ] Add dolphin

- [ ] Add physics and make volcano explode in Kilauea
- [ ] Change dragon's colour in Komodo
- [ ] Add dialog and back button to Komodo
- [ ] Fix animations on Komodo

- [ ] Add other icons to world
- [ ] Fix colour space
- [ ] Fix design of buttons and dialogs
- [ ] Add Leva
- [ ] Add music and music interface
- [ ] Add Bunny to home screen
- [ ] Fix for mobile
- [ ] Fix orbit controls and positioning of maps
- [ ] Add Perf
- [ ] Add more interactivity
- [ ] Improve Load Page
- [ ] Fix Icons on scroll around the horizon
- [ ] Dispose of items on fly to (they get in the way), shorten the animation

## Islands

### Kīlauea

Is one of the world's youngest and most active Volcanoes on the Island of Hawai'i. [Source](https://www.usgs.gov/volcanoes/kilauea) live streaming [USGS](https://www.youtube.com/usgs/live). It is home to a lava lake that appeared on September 29, 2021 [Source](https://www.nps.gov/havo/learn/nature/kilauea.htm)

Volcano by Poly by [Google](https://poly.pizza/u/Poly%20by%20Google)[CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Low Poly Pizza](https://poly.pizza/m/dwSigTeSMCo)

Voice generated using Jessica on 11Labs

### Komodo

The Komodo National Park can be found on volcanic islands and is home to 5,700 giant "Komodo Dragon" lizards Varanus Komodoensis that grow to an average of 2 - 3 meters. This is a Unesco site.
[Source](https://whc.unesco.org/en/list/609/)

Dragon by [Quaternius](https://poly.pizza/m/VBvzjFIYws)

### Farallon

Also known as "The Devil's Teeth". It is inhabited by researchers, and is not open to the public. The islands have strong winds and swells and is often surrounded by dense fog. It's been attributed to 400 ship and aircraft wrecks. It is also famously home to large numbers of great white sharks. [Source](https://www.oceanicsociety.org/learn/farallon-islands-the-ultimate-guide/#:~:text=The%20Farallon%20Islands%20can%20only,readily%20seen%20from%20a%20boat.)

Shark by Quaternius via [Low Poly Pizza](https://poly.pizza/m/YYsK3gRCBZ)
Voice generated using Dan on 11Labs

### Gallapagos

Turtle by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/2LCcq8vhqJ3)
Voice generated using Jessica on 11Labs

### Tuvalu

The sinking island country [Source](sinking-reality-how-climate-change-is-threatening-a-small-island-nation/) "tuvalu" or is a group of eight islands [Source](https://www.cia.gov/the-world-factbook/countries/tuvalu/). One of the world's least visited countries, and is currently facing an existential threat due to rising ocean levels. It is one of the smallest and most remote islands in the world. [Source](https://www.timelesstuvalu.com/) For COP26 Tuvalu's Foreign Minister Simon Kofe addressed the crowd knee deep in water calling for climate action. [Source](https://earth.org/tuvalus-sinking-reality-how-climate-change-is-threatening-a-small-island-nation/)

Boat by Poly by Google[CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/d2QPCNGeGp3)
Rabbit With pigtails by [Quaternius](https://poly.pizza/m/SwKX8OIlw8)
Dolphin by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/6hMLIu8wZP8)
Voice generated using Jessica on 11Labs

### taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronu

- One of the longes names in the world with 85 characters. It translates into "he place where Tamatea, the man with the big knees, who slid, climbed and swallowed mountains, known as 'landeater’, played his flute to his loved one." According to Newzealand.com It's known locally as Taumata HIll. Tamatea was a legendary chief and warrior. [Source](https://www.newzealand.com/us/feature/the-longest-place-name-in-new-zealand/)

Wooden Sign by iPoly3D via [Low PolyPizza](https://poly.pizza/m/SpRHK36gNl)
Boombox by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/4hZk7Fg8KiP)

Audio
Speaker: MecanautesRecorder: Mecanautes, CC0, via Wikimedia Commons
https://commons.wikimedia.org/wiki/File:LL-Q150_(fra)-Mecanautes-taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu.wav
Voice generated using Jessica on 11Labs

Favicon generated by[MidJourney](https://www.midjourney.com) with the following prompt: neon island single palm tree favicon simple clear and then converted into a .ico file with [Convertio](https://convertio.co/)
