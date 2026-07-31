'use client'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Stranice bez header-a i footer-a
const NO_CHROME_PATHS = ['/paketi']

export default function ConditionalChrome({ children }) {
  const pathname = usePathname()
  const hideChrome = NO_CHROME_PATHS.some(
    p => pathname === p || pathname.startsWith(p + '/')
  )

  return (
    <div className='bg-[#261A54] flex flex-col nnb-wrapper bg-full'>
      {!hideChrome && <Header />}
      <main className="flex-1 min-h-screen flex-col nnb-wrapper">{children}</main>
      {!hideChrome && <Footer />}
    </div>
  )
}
