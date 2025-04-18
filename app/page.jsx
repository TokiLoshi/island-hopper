// 'use client'

// import dynamic from 'next/dynamic'
// import Link from 'next/link'
// import { Suspense } from 'react'

// const MapboxGlobeWithNoSSR = dynamic(() => import('@/components/dom/MapboxGlobe'), { ssr: false})
// const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
// const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
// const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
// const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
//   ssr: false,
//   loading: () => (
//     <mesh>
//       <boxGeometry />
//       <meshStandardMaterial color='red' />
//     </mesh>
//   ),
// })
// const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

// export default function Page() {
//   return (
//     <>
//       <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
//         {/* jumbo */}
//         <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
//           <p className='w-full uppercase'>The very beggining</p>
//           <h1 className='my-4 text-5xl font-bold leading-tight'>Island Hopper</h1>
//           <p className='mb-8 text-2xl leading-normal'>
//             A project to learn mapbox, next and react three fiber. As a three.js journey challenge.
//           </p>
//           <Link href='/example'>Starter Code</Link>
//         </div>
//         <View orbit className='relative h-full  sm:h-48 sm:w-full'>
//           <Suspense fallback={null}>
//             <Dog scale={2} position={[0, -1.6, 0]} rotation={[0.0, -0.3, 0]} />
//             <Common color={'lightpink'} />
//           </Suspense>
//         </View>
//       </div>
//       {/* Add the MapboxExample component */}
//       <div className='mx-auto w-full p-6 lg:w-4/5'>
//         <h2 className='mb-4 text-2xl font-bold'>Mapbox Integration</h2>
//         <Suspense
//           fallback={
//             <div className='flex h-96 w-full items-center justify-center bg-gray-200'>Loading map component...</div>
//           }
//         ></Suspense>
//       </div>
//     </>
//   )
// }

// app/page.js
'use client'

import dynamic from 'next/dynamic'

// Dynamic import with no SSR for the Mapbox component
// This ensures it only loads on the client side
const MapboxGlobeWithNoSSR = dynamic(() => import('@/components/canvas/MapboxExample'), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='absolute left-0 top-0 size-full'>
        <MapboxGlobeWithNoSSR />
      </div>
    </>
  )
}
