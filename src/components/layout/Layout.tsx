import { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import { TopNavigation } from './TopNavigation'
import { useAuthStore } from '#/store/useAuthStore'
import { useThemeStore } from '#/store/useThemeStore'

export function Layout() {
  useEffect(() => {
    useAuthStore.persist.rehydrate()
    useThemeStore.persist.rehydrate()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
