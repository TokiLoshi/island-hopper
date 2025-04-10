'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color='red' />
    </mesh>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
        {/* jumbo */}
        <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
          <p className='w-full uppercase'>The very beggining</p>
          <h1 className='my-4 text-5xl font-bold leading-tight'>Island Hopper</h1>
          <p className='mb-8 text-2xl leading-normal'>
            A project to learn mapbox, next and react three fiber. As a three.js journey challenge.
          </p>
          <Link href='/example'>Starter Code</Link>
        </div>
        <View orbit className='relative h-full  sm:h-48 sm:w-full'>
          <Suspense fallback={null}>
            <mesh position={[-2, 1, 1]}>
              <boxGeometry />
              <meshStandardMaterial color='red' />
            </mesh>
            <Dog scale={2} position={[0, -1.6, 0]} rotation={[0.0, -0.3, 0]} />
            <Common color={'lightpink'} />
          </Suspense>
        </View>
      </div>
    </>
  )
}
