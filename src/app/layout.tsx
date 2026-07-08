import type { Metadata } from 'next'
// import { Inter, OpenSans,  } from 'next/font/google'
import '@/styles/global.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics'
import Providers from './providers'
import WelcomeModal from '@/components/WelcomeModal'
import ProfileCompletionModal from '@/components/ProfileCompletionModal'

// const opensans = OpenSans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noćni bazar',
  description: 'Noćni bazar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const appEnv = process.env.NEXT_PUBLIC_ENV || process.env.NEXT_PUBLIC_APP_ENV
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true' || process.env.ALLOW_INDEXING === 'true'
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0' />
        <link
          rel='icon'
          href={process.env.favicon}
        />
        <meta name='theme-color' content='#000000' />
        {!allowIndexing && (
          <>
            <meta name='googlebot' content='noindex' />
            <meta name='googlebot-news' content='nosnippet' />
            <meta name='googlebot-news' content='noindex' />
            <meta name='robots' content='noindex' />
          </>
        )}
        <link rel='apple-touch-icon' href='/logo.png' />
        {/* <link rel='manifest' href='/manifest.json' /> */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link 
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link 
          href='https://fonts.googleapis.com/css2?family=Open Sans:wght@400;700&family=MADA GoodTime Script:wght@400&display=optional'
          rel='stylesheet'
        />
        <link href="https://fonts.cdnfonts.com/css/made-goodtime-script" rel="stylesheet" />
                
      </head>
       <body>
        <Providers>
          <div className='bg-[#261A54] flex flex-col nnb-wrapper bg-full'>
            <Header />
            <main className="flex-1 min-h-screen flex-col nnb-wrapper">{children}</main>
            {/* <SnackBarToast /> */}
            <Footer />
          </div>
          <WelcomeModal />
          <ProfileCompletionModal />
        </Providers>
        
      </body>
    </html>
  )
}
