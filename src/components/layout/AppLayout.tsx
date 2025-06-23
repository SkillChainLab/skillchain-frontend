'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { cn } from '@/components/ui/DesignSystem'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function AppLayout({ children, className }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // Don't show sidebar on landing page
  const showSidebar = pathname !== '/'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <Sidebar />}
      
      <main
        className={cn(
          'transition-all duration-300',
          showSidebar ? (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64') : '',
          className
        )}
      >
        {children}
      </main>
    </div>
  )
} 