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
- [x] Install Zustand
- [x] Add all maps
- [x] Grammarly all the dialogs
- [x] Generate voice overs with eleven labs
- [x] Edit the voice over into clips with the dialog
- [x] Get audio button to show next to the dialogs
- [x] Add a play button next to each dialog
- [x] Change dragon's colour in Komodo
- [x] Add dialog and back button to Komodo
- [x] Add Leva
- [x] Add Bunny to home screen
- [x] Fix orbit controls and positioning of maps
- [x] Fix colour space
- [x] Add endscreen with bunny for when experience is done
- [x] Finish rigging up the guided tour
- [x] Add custom items
- [x] Starting page - dialog, narration, add leva, make smaller (smaller and moved to text)
- [x] Speed up animation on map
- [x] Animate the sprite for the Turtle so that it looks like it walks back and forth
- [x] Dolphin animation swim
- [x] Add Rain to the Galapagos [mapbox](https://docs.mapbox.com/mapbox-gl-js/example/rain/)
- [x] Experiment with different Pitches from this [tutorial](https://docs.mapbox.com/mapbox-gl-js/example/switch-symbol-style-pitch/)

## Still to do

#### Wednesday 23 April

- [x] Add animations to onClicks for all models
- [x] Add bloom to BoomBox
- [ ] Add starter overlay and work on volume controls

#### Thursday 24 April

- [ ] Add physics and make volcano explode in Kilauea
- [ ] Draw between the locations (free to explore - store the route in Zustand)
- [ ] Use this [tutorial](https://docs.mapbox.com/mapbox-gl-js/example/line-pattern/) for drawing lines or an ant path [tutorial](https://docs.mapbox.com/mapbox-gl-js/example/animate-ant-path/) or through [line animation](https://docs.mapbox.com/mapbox-gl-js/example/animate-a-line/)
- [ ] Measure distances and add total km to end voiceover
- [ ] Review the different satellite [options](https://docs.mapbox.com/api/maps/styles/)
- [ ] Loading screen for starter - fix volume across app pages global volume
- [ ] Smoke Shader for Kilauea

#### Friday 25 April

- [ ] Add part about stinky breath to Komodo [Komodos have infamously horrible, acrid, eye-wateringly bad breath, and for a good reason. Shreds of meat and viscera from previous meals tend to get stuck in those serrated teeth, making them prime breeding grounds for deadly bacteria.Jul 6, 2023](https://www.discovermagazine.com/planet-earth/what-is-so-interesting-about-the-komodo-dragon)
- [ ] Last frame add a lizard model and shader to represent the stinky breath

#### Saturday 26 April

- [ ] Work on UI

#### Sunday 27 April

- [ ] Investigate whether to add Zustand persist
- [ ] Water shader for Tuvalu to rise when Dolphin arrives
- [ ] Fix UI
- [ ] Water Shader to galapagos, tuvalu
- [ ] Bubbles shader to Farallon or [caustics](https://drei.docs.pmnd.rs/staging/caustics)

#### Monday 28 April

- [ ] Fireworks shader for the end- colours with all the country flags
- [ ] Performances
- [ ] Work on mobile

#### Tuesday 29 April

- [ ] Performances and smooth animations

#### Wednesday 30 April

- [ ] Design and Performances
- [ ] Clean up README, and gifs and info, tweet and submit

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
Dolphin by Quaternius (https://poly.pizza/m/3LzFgI3GLO)

### taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronu

- One of the longes names in the world with 85 characters. It translates into "he place where Tamatea, the man with the big knees, who slid, climbed and swallowed mountains, known as 'landeater’, played his flute to his loved one." According to Newzealand.com It's known locally as Taumata HIll. Tamatea was a legendary chief and warrior. [Source](https://www.newzealand.com/us/feature/the-longest-place-name-in-new-zealand/)

Wooden Sign by iPoly3D via [Low PolyPizza](https://poly.pizza/m/SpRHK36gNl)
Boombox by Poly by Google [CC-BY](https://creativecommons.org/licenses/by/3.0/) via [Poly Pizza](https://poly.pizza/m/4hZk7Fg8KiP)

Audio
Speaker: MecanautesRecorder: Mecanautes, CC0, via Wikimedia Commons
https://commons.wikimedia.org/wiki/File:LL-Q150_(fra)-Mecanautes-taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu.wav
Voice generated using Jessica on 11Labs

Background music Track by [Pufino](https://pixabay.com/users/pufino-47222373/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=318954)from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=318954)

Music by [Lidérc](https://pixabay.com/users/lidérc-34910776/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=202298) from [Pixabay](https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=202298)

Favicon generated by[MidJourney](https://www.midjourney.com) with the following prompt: neon island single palm tree favicon simple clear and then converted into a .ico file with [Convertio](https://convertio.co/)

## Changes made to models in Canva:

Creating icons for visited, unvisited and next with different background colours using the Obj file in low poly pizza
