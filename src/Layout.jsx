import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '@/components/organisms/Header'
import Footer from '@/components/organisms/Footer'

function Layout() {
  const location = useLocation()
  const [isOnboarding, setIsOnboarding] = useState(false)

  useEffect(() => {
    setIsOnboarding(location.pathname === '/onboarding')
  }, [location.pathname])

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 main-content overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout