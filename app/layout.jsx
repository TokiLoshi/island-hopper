import { Layout } from '@/components/dom/Layout'
import './global.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Island Hopper',
  description: 'Experience Different Islands in 3D, a Three.js Journey Challenge Adventure',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/palm.png', media: '(prefers-color-scheme: dark)' },
      { url: '/plamlight.png', media: '(prefers-color-scheme: light)' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
        <Analytics />
      </body>
    </html>
  )
}
